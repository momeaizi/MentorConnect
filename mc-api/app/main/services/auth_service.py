from app.main.utils.jwt import create_custom_access_token
from flask import current_app as app
from app.main.utils.exceptions import UniqueConstraintError
from app.main.utils.mail import send_verification_email, send_email
from app.main.utils.password import update_password
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from app.main import bcrypt
from app.db.sql_executor import execute_query
from loguru import logger
from flask import jsonify
import jwt

serializer = URLSafeTimedSerializer("secret_key")

def register_user(data):
    try:
        insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s, %s, %s) RETURNING *"
        new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        if not new_user.get('is_verified', None):
            return jsonify({'status': 'error', 'message': 'Verify Your Email', 'email': new_user.get('email')}), 401
        access_token = create_custom_access_token(identity={
            "id": new_user.get('id', None),
            "email": new_user.get('email', None),
            "username": new_user.get('username', None),
            "is_verified": new_user.get('is_verified', None),
            "is_complete": False,
        })
        return jsonify(access_token=access_token), 200
    except UniqueConstraintError as e:
        return jsonify({
            "status": "error",
            "message": f"{e.field} already exists",
        }), 409
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Error registring user'}), 500

def verify_acount_service(data):
    try:
        select_query = "SELECT * FROM users WHERE email = %s"
        user = execute_query(select_query, params=(data.get('email',None),) ,fetch_one=True)
        if not user:
            return jsonify({"message": "User not found"}), 404
        if user.get('is_verified', None):
            return jsonify({"message": "This email address has already been verified. No further action is required."}), 409
        send_verification_email(user.get('email', None), user.get('id', None))
        return jsonify({'message': 'Verification email sent successfully'}), 201
    except UniqueConstraintError as e:
        return jsonify({
            "status": "error",
            "message": f"{e.field} already exists",
        }), 409
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Error registring user'}), 500

def login_user(data):
    try:
        select_query = "SELECT * FROM users WHERE username = %s"
        user = execute_query(select_query, params=(data.get('username', None),) ,fetch_one=True)
        logger.info(user)
        if user and bcrypt.check_password_hash( user.get('password_hash',None), data.get('password',None)):
            if not user.get('is_verified', None):
                return jsonify({'status': 'error', 'message': 'Verify Your Email', 'email': user.get('email')}), 401

            access_token = create_custom_access_token(identity={
                "id": user.get('id', None),
                "email": user.get('email', None),
                "username": user.get('username', None),
                "is_verified": user.get('is_verified',False),
                "is_complete": user.get('is_complete', False),
            })
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'status': 'error', 'message': 'Incorrect username or password'}), 401
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'status': 'error', 'message': 'An unexpected error occurred'}), 500

def verify_email_service(token):
    try:
        decoded = jwt.decode(token, app.config['JWT_PUBLIC_KEY'], algorithms=app.config['JWT_ALGORITHM'])
        id = decoded["id"]
        update_query = "UPDATE users SET is_verified = TRUE WHERE id = %s RETURNING *"
        updated_user = execute_query(update_query, params=(id, ), fetch_one=True)
        access_token = create_custom_access_token(identity={
            "id": updated_user.get('id', None),
            "email": updated_user.get('email', None),
            "username": updated_user.get('username', None),
            "is_verified": updated_user.get('is_verified',None),
            "is_complete":  updated_user.get('is_complete',None),
        })
        return jsonify(access_token=access_token), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "The verification link has expired."}), 404
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token. Please request a new verification link."}), 404

def forgot_password_service(email):
    try:
        select_query = "SELECT * FROM users WHERE email = %s"
        user = execute_query(select_query, params=(email,) ,fetch_one=True)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        token = serializer.dumps(email, salt='password-reset-salt')
        reset_url = f"{app.config['FRONTEND_URL']}/reset-password/{token}"

        body = f"Click the link to reset your password: {reset_url}"
        logger.info(email)
        send_email("Password Reset Request", body, [email])
        return jsonify({"message": "Password reset link sent to your email"}), 200
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return jsonify({"message": "Failed to send email"}), 500



def reset_password_service(token, new_password):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600) #1h
    except SignatureExpired:
        return jsonify({"message": "The token has expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid token"}), 400


    password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    if update_password(email, password_hash):
        return jsonify({"message": "Password reset successfully"}), 200
    else:
        return jsonify({"message": "Failed to reset password"}), 500


def update_password_service(user, data):
    try:
        user_id = user.get('id', None)
        select_query = "SELECT * FROM users WHERE id = %s"
        user = execute_query(select_query, params=(str(user.get('id', None)),) ,fetch_one=True)
        if user and bcrypt.check_password_hash( user.get('password_hash',None), data.get('password')):
            new_password_hash = bcrypt.generate_password_hash(data.pop('new_password')).decode('utf-8')
            update_password_query = f"UPDATE  users SET password_hash = %s WHERE id = %s RETURNING *"
            new_user = execute_query(update_password_query, params=(new_password_hash,user_id,), fetch_one=True)
        else:
            return jsonify(status='error', message="passwrod is wrong"), 400
        return jsonify(status='success', message=new_user), 200
    except Exception as e:
        return jsonify({"message": "Failed to update password"}), 500

from app.main.utils.jwt import create_custom_access_token
from flask import current_app as app
from app.main.utils.exceptions import UniqueConstraintError
from app.main.utils.mail import send_verification_email
from app.main.utils.password import update_password
from itsdangerous import URLSafeTimedSerializer
from app.main import bcrypt, mail, Message
from app.db.sql_executor import execute_query
from loguru import logger
from flask import jsonify, url_for
import jwt

serializer = URLSafeTimedSerializer("secret_key")

def register_user(data):
    try:
        insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        send_verification_email(new_user.get('email', None), new_user.get('id', None))
        access_token = create_custom_access_token(identity={
            "id": new_user.get('id', None),
            "email": new_user.get('email', None),
            "username": new_user.get('username', None),
            "validate": new_user.get('validate',None),
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
        select_query = "SELECT * FROM users WHERE username = %s"
        user = execute_query(select_query, params=(data.get('username',None),) ,fetch_one=True)
        if not user:
            return jsonify({"message": "User not found"}), 404
        if user.get('validate', None):
            return jsonify({"message": "This Account Is Verify"}), 200
        send_verification_email(user.get('email', None), user.get('id', None))
        return jsonify({'message': 'Send Verification Email'}), 201
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
        user = execute_query(select_query, params=(data.get('username',None),) ,fetch_one=True)

        if user and bcrypt.check_password_hash( user.get('password_hash',None), data.get('password',None)):
            access_token = create_custom_access_token(identity={
                "id": user.get('id', None),
                "email": user.get('email', None),
                "username": user.get('username', None),
                "validate": user.get('validate',None),
            })
            return jsonify(access_token=access_token), 200
        elif user and user.get('validated',None) == False:
            return jsonify({'status': 'error', 'message': 'Validate Your Account'}), 401
        elif user:
            return jsonify({'status': 'error', 'message': 'Incorrect Password'}), 401
        else:
            return jsonify({'status': 'error', 'message': f"user {data['username']} doesn't exist"}), 401
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def verify_email_service(token):
    try:
        decoded = jwt.decode(token, app.config['JWT_PRIVATE_KEY'], algorithms=app.config['JWT_ALGORITHM'])
        id = decoded["id"]
        update_query = f"""UPDATE users SET validate = TRUE WHERE id = %s RETURNING *"""
        updated_user = execute_query(update_query, params=(str(id)), fetch_one=True)
        access_token = create_custom_access_token(identity={
            "id": updated_user.get('id', None),
            "email": updated_user.get('email', None),
            "username": updated_user.get('username', None),
            "validate": updated_user.get('validate',None),
        })
        return jsonify(access_token=access_token), 200
    except jwt.ExpiredSignatureError:
        return "The verification link has expired."
    except jwt.InvalidTokenError:
        return "Invalid token. Please request a new verification link."

def forgot_password_service(email):
    select_query = "SELECT * FROM users WHERE email = %s"
    user = execute_query(select_query, params=(email,) ,fetch_one=True)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    token = serializer.dumps(email, salt='password-reset-salt')
    reset_url = url_for('auth_bp.reset_password', token=token, _external=True)

    try:
        msg = Message("Password Reset Request", recipients=[email])
        msg.body = f"Click the link to reset your password: {reset_url}"
        mail.send(msg)
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return jsonify({"message": "Failed to send email"}), 500

    return jsonify({"message": "Password reset link sent to your email"}), 200


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

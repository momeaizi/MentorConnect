from flask import Blueprint, request, jsonify
from loguru import logger
from app.main import bcrypt
from app.main import mail
from app.main.services.auth_service import register_user, login_user
from app.db import execute_query
from flask_mail import Message

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = {
        "username" : request.json.get('username'),
        "email" : request.json.get('email'),
        "password_hash" : bcrypt.generate_password_hash(request.json.get('password')).decode('utf-8')
    }
    return register_user(data)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = {
        "username" : request.json.get('username'),
        "password" : request.json.get('password')
    }
    return login_user(data)

@auth_bp.route('/verify/<token>')
def verify_email(token):
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=[app.config['JWT_ALGORITHM']])
        id = decoded["id"]
        # Update the user's verified status in the database
        user = User.query.get(id)
        user.is_verified = True
        db.session.commit()
        return "Your email has been verified successfully!"
    except jwt.ExpiredSignatureError:
        return "The verification link has expired."
    except jwt.InvalidTokenError:
        return "Invalid token. Please request a new verification link."

@auth_bp.route('/email')
def send_test_email():
    msg = Message("Test Email", recipients=["abdelmonaimskerba@gmail.com"])
    msg.body = "This is a test email."
    mail.send(msg)
    return "Test email sent!"


from flask import Blueprint, request, jsonify, url_for
from loguru import logger
from app.main import bcrypt
from app.main import mail , Message
from app.main.services.auth_service import register_user, login_user, verify_email_service, forgot_password_service, reset_password_service
from app.db import execute_query
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask import current_app as app

auth_bp = Blueprint('auth_bp', __name__)

SECRET_KEY = "your-secret-key"
serializer = URLSafeTimedSerializer(SECRET_KEY)

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
    return verify_email_service(token)


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    return forgot_password_service(email)
    
@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):    
    new_password = request.json.get('new_password', None)
    if not new_password:
        return jsonify({"message": "New password is required"}), 400
    return reset_password_service(token, new_password)

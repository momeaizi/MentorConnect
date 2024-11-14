from flask import Blueprint, request, jsonify
from loguru import logger
from app.main import bcrypt
from app.main.services.auth_service import register_user, login_user
from app.db import execute_query

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

# @auth_bp.route('/resetpassword')

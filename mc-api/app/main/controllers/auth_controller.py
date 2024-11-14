from flask import Blueprint, request, jsonify
from app.main.services.user_service import create_user
from app.main import bcrypt
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import uuid
from datetime import datetime, timedelta
from flask import current_app as app

auth_bp = Blueprint('auth_bp', __name__)

def create_custom_access_token(identity):
    headers = {'kid': 'ckxjzeb7c0000z04q9u9d4bt4'}
    
    now = datetime.utcnow()
    payload = {
        **identity,
        "exp": (now + timedelta(hours=1)).timestamp(),
        "iat": now.timestamp(),
        "auth_time": now.timestamp() - 2,
        "jti": str(uuid.uuid4()),
        "sub": str(uuid.uuid4()),
        "typ": "Bearer",
    }
    
    encoded_jwt = payload
    encoded_jwt = jwt.encode(payload, app.config['JWT_PRIVATE_KEY'], algorithm=app.config['JWT_ALGORITHM'], headers=headers)
    
    return encoded_jwt



@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    # if User.query.filter_by(username=username).first():
    #     return jsonify({'msg': 'Username already exists'}), 400

    # if User.query.filter_by(email=email).first():
    #     return jsonify({'msg': 'Email already exists'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')


    data = {    "username" : username,
                "email" : email,
                "password_hash" : password_hash
            }
    # user = User(username=username, email=email, password_hash=password_hash)

    # db.session.add(user)
    # db.session.commit()
    create_user(data)

    return jsonify({'msg': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        try:
            access_token = create_custom_access_token(identity={
                "id": user.id,
                "email": user.email,
                "username": user.username,
            })
        except:
            return jsonify("mochkil"), 400
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'msg': 'Invalid credentials'}), 401

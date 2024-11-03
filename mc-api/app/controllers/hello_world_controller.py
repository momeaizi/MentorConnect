from flask import Blueprint, jsonify, request
from app.services.hello_world_service import get_user

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    user = get_user()
    return jsonify(user), 200

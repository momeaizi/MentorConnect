from flask import Blueprint, jsonify, request
from app.services.user_service import get_user
from app.utils.decorators import expect_dto
from app.utils.dtos import RegisterUserDTO

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['POST'])
@expect_dto(RegisterUserDTO)
def get_users():
    data = request.json
    user = get_user()
    return jsonify(user), 200

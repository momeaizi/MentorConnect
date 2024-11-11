from flask import Blueprint, jsonify, request
from app.main.services.user_service import get_user
from app.main.utils.decorators import expect_dto
from app.main.utils.dtos import RegisterUserDTO
from loguru import logger

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/')
# @expect_dto(RegisterUserDTO)
def get_users():
    users = get_user()
    logger.info(users)
    return jsonify(users), 200

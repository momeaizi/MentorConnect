from flask import Blueprint, jsonify, request
from app.main.services.user_service import fetch_users, fetch_user, create_user, update_user, remove_user
from app.main.utils.decorators import expect_dto
from app.main.utils.dtos import RegisterUserDTO
from loguru import logger


user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/')
def get_users():
    users = fetch_users()
    return jsonify(users), 200


@user_bp.route('/<int:id>')
def get_user(id):
    user = fetch_user(id)
    return jsonify(user), 200


@user_bp.route('/', methods=['POST'])
@expect_dto(RegisterUserDTO, validate=True)
def add_user():
    data = request.json
    new_user = create_user(data)
    return jsonify(new_user), 201


@user_bp.route('/<int:id>', methods=['PATCH'])
@expect_dto(RegisterUserDTO)
def patch_user(id):
    data = request.json
    logger.info(data)
    new_user = update_user(id, data)
    return jsonify(new_user), 200


@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    removed_user = remove_user(id)
    return jsonify(removed_user), 200
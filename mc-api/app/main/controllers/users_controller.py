from flask import Blueprint, request
from app.main.services.users_service import UserService
from app.main.utils.decorators import expect_dto
from app.main.utils.dtos import RegisterUserDTO


user_bp = Blueprint('user_bp', __name__)
user_service = UserService()

@user_bp.route('/')
def get_users():
    return user_service.fetch_users()


@user_bp.route('/<int:id>')
def get_user(id):
    return user_service.fetch_user(id)


@user_bp.route('/', methods=['POST'])
@expect_dto(RegisterUserDTO, validate=True)
def add_user():
    data = request.json
    return user_service.create_user(data)


@user_bp.route('/<int:id>', methods=['PATCH'])
@expect_dto(RegisterUserDTO)
def patch_user(id):
    data = request.json
    return user_service.update_user(id, data)


@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    return user_service.remove_user(id)

from flask import Blueprint, request
from app.main.services.user_service import fetch_users, fetch_user, create_user, update_user, remove_user
from app.main.utils.decorators import expect_dto
from app.main.utils.dtos.auth_dto import (
    RegisterUserDTO, LoginUserDTO, 
    ForgotPasswordDTO, ResetPasswordDTO,
    VerifyAccountDTO
    )
from app.main.utils.decorators import token_required
from loguru import logger

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/')
@token_required
def get_users(user):
    return fetch_users()


@user_bp.route('/<int:id>')
def get_user(id):
    return fetch_user(id)


@user_bp.route('/', methods=['POST'])
@token_required
@expect_dto(RegisterUserDTO, validate=True)
def add_user(user, data):
    return {"user":user, "data":data}


@user_bp.route('/<int:id>', methods=['PATCH'])
@expect_dto(RegisterUserDTO)
def patch_user(id):
    data = request.json
    return update_user(id, data)


@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    return remove_user(id)

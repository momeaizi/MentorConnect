from flask import Blueprint, request, jsonify
from loguru import logger
from app.main import bcrypt
from app.main.services.auth_service import (
    register_user, login_user, verify_email_service,
    forgot_password_service, reset_password_service,
    verify_acount_service, update_password_service
)
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from app.main.utils.dtos.auth_dto import (
    RegisterUserDTO, LoginUserDTO, 
    ForgotPasswordDTO, ResetPasswordDTO,
    VerifyAccountDTO
    )

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
@expect_dto(RegisterUserDTO, validate=True)
def register(data):
    data['password_hash'] = bcrypt.generate_password_hash(data.pop('password')).decode('utf-8')
    return register_user(data)

@auth_bp.route('/verify_account', methods=['POST'])
@expect_dto(VerifyAccountDTO, validate=True)
def verify_acount(data):
    return verify_acount_service(data)

@auth_bp.route('/login', methods=['POST'])
@expect_dto(LoginUserDTO, validate=True)
def login(data):
    return login_user(data)

@auth_bp.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    return verify_email_service(token)

@auth_bp.route('/forgot-password', methods=['POST'])
@expect_dto(ForgotPasswordDTO, validate=True)
def forgot_password(data):
    return forgot_password_service(data['email'])

@auth_bp.route('/reset-password/<token>', methods=['POST'])
@expect_dto(ResetPasswordDTO, validate=True)
def reset_password(token, data):
    return reset_password_service(token, data['new_password'])


@auth_bp.route('/update-password', methods=['PATCH'])
# # @expect_dto(ResetPasswordDTO, validate=True)
@token_required
def update_password(user):
    data = request.json
    return update_password_service(user, data)
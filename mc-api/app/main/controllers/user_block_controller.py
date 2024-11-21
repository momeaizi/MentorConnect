from flask import Blueprint
from app.main.utils.decorators import expect_dto
from app.main.utils.decorators import token_required
from app.main.services.user_block_service import UserBlockService


user_block_bp = Blueprint('user_block_bp', __name__)

user_block_service = UserBlockService()


@user_block_bp.route('/<int:id>/block', methods=['POST'])
@token_required
def block_user(user, id):
    return user_block_service.block_user(user.get('id', None), id)


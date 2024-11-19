from flask import Blueprint, request, jsonify
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from app.main.services.profile_service import (
    get_profile_service, update_profile_service
)

profile_bp = Blueprint('profile_bp', __name__)

#? Get Profile
@profile_bp.route('/conversation', methods=['POST'])
@token_required
def get_profile(user):
    user_id = user.get('id', None)
    return get_profile_service(user_id)


#? Update Profile
@profile_bp.route('/conversation', methods=['PATCH'])
@token_required
def update_profile(user):
    data = request.json
    return update_profile_service(data)

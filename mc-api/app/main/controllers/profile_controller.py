from flask import Blueprint, request, jsonify, flash, redirect, url_for
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from werkzeug.utils import secure_filename
from app.main.services.profile_service import (
    get_profile_service, update_profile_service,
    handle_profile_picture_service, handle_other_pictures_service,
    get_image_service
)
import os
from flask import current_app as app
import uuid
from flask import send_file


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


#? Upload or Update profile image
@profile_bp.route('/picture', methods=['POST'])
@token_required
def handle_profile_picture(user):
    profile_file = request.files.get('profile')
    return handle_profile_picture_service(user, profile_file)


#? Upload or Update images
@profile_bp.route('/pictures', methods=['POST'])
@token_required
def handle_other_pictures(user):
    request_file = request.files
    return handle_other_pictures_service(user, request_file)

#? Get Image With Name
@profile_bp.route('/get_image/<filename>', methods=['GET'])
@token_required
def get_image(user, filename):
    return get_image_service(user, filename)

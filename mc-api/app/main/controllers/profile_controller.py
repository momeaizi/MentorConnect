from flask import Blueprint, request, jsonify, flash, redirect, url_for
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from werkzeug.utils import secure_filename
from app.main.services.profile_service import (
    get_profile_service, update_profile_service
)
import os
from flask import current_app as app


profile_bp = Blueprint('profile_bp', __name__)
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

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



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

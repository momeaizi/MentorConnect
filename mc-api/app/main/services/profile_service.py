import os
from app.main.utils.jwt import create_custom_access_token
from flask import jsonify
from loguru import logger
from app.db.sql_executor import execute_query
from flask import send_file
from werkzeug.utils import secure_filename
from flask import current_app as app
import uuid

def get_profile_service(user_id):
    try:
        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

        select_query = "SELECT * FROM users WHERE id = %s"
        profile = execute_query(select_query, params=(str(user_id)), fetch_one=True)

        profile['birth_date'] = (
            profile['birth_date'].strftime('%Y-%m-%d') if profile['birth_date'] else ''
        )

        profile['gender'] = (True) if profile.get('gender', None) == 'Male' else (False)

        profile_query = "SELECT * FROM pictures WHERE user_id = %s AND is_profile = TRUE;"
        image = execute_query(profile_query, params=(str(user_id)), fetch_one=True)
        if image:
            profile['file_name'] = image.get('file_name')

        images_query = "SELECT * FROM pictures WHERE user_id = %s AND is_profile = FALSE;"
        images = execute_query(images_query, params=(str(user_id)), fetch_all=True)
        
        if images:
            images_names = [item['file_name'] for item in images]
            profile['images_name'] = images_names


        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving notifications: {str(e)}"}), 500
    
#TODO CHANGE VALUES TO ALL DATA
def update_profile_service(data, user):
    try:
        user_id = user.get('id', None)
        gender = '\'Male\'' if data.get('gender') else '\'Female\''
        update_query = f"UPDATE users SET first_name = %s , last_name = %s , email = %s , username = %s , bio = %s , gender = {gender}, birth_date = %s , latitude = %s , longitude = %s, is_complete = TRUE  WHERE id = %s RETURNING *"
        updated_profile = execute_query(update_query, params=(data.get('first_name'), data.get('last_name'), data.get('email'), data.get('username'), data.get('bio'), data.get('birth_date'), data.get('latitude'), data.get('longitude'), str(user_id)))
        logger.info(updated_profile)
        access_token = create_custom_access_token(identity={
            "id": user_id,
            "email": data.get('email'),
            "username": data.get('username', None),
            "is_verified": True,
            "is_complete": True,
        })
        return jsonify(access_token=access_token), 200
        return jsonify({'status': 'success', 'message': updated_profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error deleting conversation: {str(e)}"}), 500

def handle_profile_picture_service(user, profile_file):
    if not profile_file:
        return jsonify({'status': 'error', 'message': 'No profile picture provided'}), 400

    user_id = user.get('id', None)
    username = user.get('username', None)

    try:
        
        delete_query = "DELETE FROM pictures WHERE user_id = %s AND is_profile = TRUE RETURNING *"
        delete_picture = execute_query(delete_query, params=(user_id,), fetch_one=True )

        if delete_picture:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], delete_picture.get('file_name', None))
            if os.path.exists(file_path):
                os.remove(file_path)


        original_filename = secure_filename(profile_file.filename)
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{username}_profile_{uuid.uuid4().hex}{file_extension}"
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        profile_file.save(save_path)


        insert_query = """
            INSERT INTO pictures (user_id, file_name, is_profile) 
            VALUES (%s, %s, %s) RETURNING *
        """
        execute_query(insert_query, params=(user_id, unique_filename, True), fetch_one=True)

        return jsonify({'status': 'success', 'message': 'Profile picture uploaded/updated successfully', 'filename': unique_filename}), 200
    except Exception as e:
        logger.error(f"Error handling profile picture: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def handle_other_pictures_service(user, request):
    user_id = user.get('id')
    username = user.get('username', 'anonymous')

    uploaded_files = []
    failed_files = []



    try:
        # select_query = "SELECT file_name FROM pictures WHERE user_id = %s AND is_profile = FALSE"
        # existing_file = execute_query(select_query, params=(str(user_id)), fetch_all=True)
        # if existing_file:
        #     logger.info(existing_file)
        #     images_names = [item['file_name'] for item in existing_file]
        #     upload_folder = app.config['UPLOAD_FOLDER']
        #     for image_name in images_names:
        #         old_file_path = os.path.join(upload_folder, image_name)
                
        #         if os.path.exists(old_file_path):
        #             os.remove(old_file_path)

        #         delete_query = "DELETE FROM pictures WHERE user_id = %s AND file_name = %s"
        #         execute_query(delete_query, params=(user_id, image_name))

        for file_key in request:
            file = request[file_key]

            if not file_key.startswith("picture"):
                failed_files.append({'file_key': file_key, 'error': 'Invalid file key'})
                continue

            if file.filename == '':
                failed_files.append({'file_key': file_key, 'error': 'No filename provided'})
                continue

            file_extension = os.path.splitext(secure_filename(file.filename))[1]
            unique_filename = f"{username}_{file_key}{file_extension}"
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

            select_query = "SELECT file_name FROM pictures WHERE user_id = %s AND file_name LIKE %s"
            existing_file = execute_query(select_query, params=(user_id, f"{username}_{file_key}%"), fetch_one=True)
            if existing_file:
                old_file_path = os.path.join(app.config['UPLOAD_FOLDER'], existing_file['file_name'])
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

                delete_query = "DELETE FROM pictures WHERE user_id = %s AND file_name = %s"
                execute_query(delete_query, params=(user_id, existing_file['file_name']))

            file.save(save_path)

            insert_query = """
                INSERT INTO pictures (user_id, file_name, is_profile) 
                VALUES (%s, %s, %s) RETURNING *
            """
            execute_query(insert_query, params=(user_id, unique_filename, False), fetch_one=True)
            uploaded_files.append({'file_key': file_key, 'filename': unique_filename})

    except Exception as e:
        logger.error(f"Error handling other pictures: {e}")
        failed_files.append({'error': str(e)})

    response = {
        'status': 'success' if not failed_files else 'partial_success',
        'uploaded_files': uploaded_files,
        'failed_files': failed_files
    }
    return jsonify(response), 200 if not failed_files else 207

def get_image_service(file_name):

    try:
        query = "SELECT file_name FROM pictures WHERE file_name = %s"
        result = execute_query(query, params=(file_name,), fetch_one=True)


        if not result:
            return jsonify({'status': 'error', 'message': 'File not found'}), 404
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], result.get('file_name'))
     
        if not os.path.exists(file_path):
            return jsonify({'status': 'error', 'message': 'File not found on server'}), 404

        return send_file(file_path, as_attachment=False)

    except Exception as e:
        logger.error(f"Error retrieving file: {e}")
        logger.error(f"Error retrieving file: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
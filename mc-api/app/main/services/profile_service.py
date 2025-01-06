import os
from flask import Blueprint, request, jsonify
from loguru import logger
from app.db.sql_executor import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from flask import send_file
from werkzeug.utils import secure_filename
from flask import current_app as app
import uuid


def get_profile_by_username_service(user_id, username):
    try:
        select_query = """
            WITH current_user_interests AS (
                SELECT 
                    i.id AS interest_id,
                    i.interest
                FROM 
                    user_interests ui
                JOIN 
                    interests i ON ui.interest_id = i.id
                WHERE 
                    ui.user_id = %s -- Current user's ID
            ),
            target_user AS (
                SELECT 
                    u.id AS user_id,
                    u.username,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.gender,
                    u.bio,
                    u.birth_date,
                    u.is_logged_in,
                    u.last_logged_in,
                    ST_X(ST_AsText(u.geolocation)) AS longitude,
                    ST_Y(ST_AsText(u.geolocation)) AS latitude,
                    DATE_PART('year', AGE(u.birth_date)) AS age,
                    ARRAY_AGG(i.interest) AS interests,
                    ARRAY_AGG(p.file_name) AS pictures,
                    u.geolocation,
                    -- Fame Rating Calculation
                    (
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_views pv
                            WHERE pv.profile_owner_id = u.id
                        ), 0) + -- Views
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_likes pl
                            WHERE pl.liked_profile_id = u.id
                        ), 0) + -- Likes
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_likes pl1
                            JOIN profile_likes pl2
                            ON pl1.liker_id = pl2.liked_profile_id AND pl1.liked_profile_id = pl2.liker_id
                            WHERE pl1.liked_profile_id = u.id
                        ), 0) -- Matches
                    ) AS fame_rating
                FROM 
                    users u
                LEFT JOIN 
                    user_interests ui ON u.id = ui.user_id
                LEFT JOIN 
                    interests i ON ui.interest_id = i.id
                LEFT JOIN 
                    pictures p ON p.user_id = i.id
                WHERE 
                    u.username = %s -- Target user's username
                GROUP BY 
                    u.id
            )
            SELECT 
                t.user_id,
                t.username,
                t.email,
                t.first_name,
                'https://thispersondoesnotexist.com/' AS image,
                t.pictures,
                t.last_name,
                t.gender,
                t.bio,
                t.birth_date,
                t.fame_rating,
                t.is_logged_in,
                t.last_logged_in,
                t.longitude,
                t.latitude,
                t.age,
                t.interests,
                ARRAY_AGG(c.interest) AS common_interests,
                ST_Distance(t.geolocation, (SELECT geolocation FROM users WHERE id = %s)) / 1000 AS distance -- Distance in kilometers
            FROM 
                target_user t
            LEFT JOIN 
                current_user_interests c ON c.interest_id = ANY (
                    SELECT ui.interest_id
                    FROM user_interests ui
                    WHERE ui.user_id = t.user_id
                )
            GROUP BY 
                t.user_id, t.username, t.email, t.first_name, t.last_name, t.gender, t.bio, 
                t.birth_date, t.fame_rating, t.is_logged_in, t.last_logged_in, t.longitude,
                t.latitude, t.age, t.interests, t.geolocation, t.pictures;
        """
        profile = execute_query(select_query, params=(user_id, username, user_id), fetch_one=True)


        if not profile:
            return jsonify({'status': 'error', 'message': 'Profile not found'}), 404

        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving notifications: {str(e)}"}), 500
    


def get_profile_service(user_id):
    try:
        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

        select_query = "SELECT * FROM users WHERE id = %s"
        profile = execute_query(select_query, params=(user_id), fetch_one=True)
        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving notifications: {str(e)}"}), 500
    
#TODO CHANGE VALUES TO ALL DATA
def update_profile_service(data):
    try:
        update_query = f"UPDATE users  ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        updated_profile = execute_query(update_query, params=tuple(data.values()))


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

def get_image_service(user, filename):
    user_id = user.get('id', None)

    try:
        query = "SELECT file_name FROM pictures WHERE user_id = %s AND file_name = %s"
        result = execute_query(query, params=(user_id, filename), fetch_one=True)

        if not result:
            return jsonify({'status': 'error', 'message': 'File not found'}), 404

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
     
        if not os.path.exists(file_path):
            return jsonify({'status': 'error', 'message': 'File not found on server'}), 404

        return send_file(file_path, as_attachment=False)

    except Exception as e:
        logger.error(f"Error retrieving file: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
import os
from app.main.utils.jwt import create_custom_access_token
from flask import jsonify
from loguru import logger
from app.db.sql_executor import execute_query
from flask import send_file
from werkzeug.utils import secure_filename
from flask import current_app as app
from app.main.utils.exceptions import UniqueConstraintError
from app.main.services.profile_views_service import ProfileViewsService
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
                    ui.user_id = %s
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
                    MAX(CASE WHEN p.is_profile THEN p.file_name END) AS image,
                    ARRAY_AGG(DISTINCT i.interest) FILTER (WHERE i.interest IS NOT NULL) AS interests,
                    ARRAY_AGG(DISTINCT p.file_name) FILTER (WHERE p.file_name IS NOT NULL) AS pictures,
                    u.geolocation,
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
                    ) AS fame_rating,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = %s AND liked_profile_id = u.id
                        ) AND EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = u.id AND liked_profile_id = %s
                        ) THEN 'mutual'
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = %s AND liked_profile_id = u.id
                        ) THEN 'one-way'
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = u.id AND liked_profile_id = %s
                        ) THEN 'liked-by'
                        ELSE 'none'
                    END AS like_status,
                    (
                        SELECT c.id 
                        FROM conversations c
                        WHERE 
                            (c.user_id_1 = %s AND c.user_id_2 = u.id) 
                            OR (c.user_id_1 = u.id AND c.user_id_2 = %s)
                        LIMIT 1
                    ) AS conversation_id,
                    CASE 
                        WHEN (
                            SELECT COUNT(*) 
                            FROM reported_users r 
                            WHERE r.reported_id = u.id
                        ) > 5 THEN TRUE
                        ELSE FALSE
                    END AS is_flagged
                FROM 
                    users u
                LEFT JOIN 
                    user_interests ui ON u.id = ui.user_id
                LEFT JOIN 
                    interests i ON ui.interest_id = i.id
                LEFT JOIN 
                    pictures p ON u.id = p.user_id
                WHERE 
                    u.username = %s
                    AND u.is_complete = TRUE
                    AND u.id != %s
                    AND NOT EXISTS (
                        SELECT 1
                        FROM blocked_users b
                        WHERE 
                            (b.blocker_id = %s AND b.blocked_id = u.id)
                            OR (b.blocker_id = u.id AND b.blocked_id = %s)
                    )
                GROUP BY 
                    u.id
            )
            SELECT 
                t.user_id,
                t.username,
                t.image,
                t.pictures,
                t.email,
                t.first_name,
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
                t.is_flagged,
                t.like_status,
                t.conversation_id,
                ARRAY_AGG(c.interest) AS common_interests,
                ST_Distance(t.geolocation, (SELECT geolocation FROM users WHERE id = %s)) / 1000 AS distance
            FROM 
                target_user t
            LEFT JOIN 
                current_user_interests c ON c.interest_id = ANY (
                    SELECT ui.interest_id
                    FROM user_interests ui
                    WHERE ui.user_id = t.user_id
                )
            GROUP BY 
                t.image, t.pictures, t.user_id, t.username, t.email, t.first_name, t.last_name, t.gender, t.bio, 
                t.birth_date, t.fame_rating, t.is_logged_in, t.last_logged_in, t.longitude, t.is_flagged,
                t.latitude, t.age, t.interests, t.geolocation, t.like_status, t.conversation_id;
        """
        profile = execute_query(select_query, params=(user_id, user_id, user_id, user_id, user_id, user_id, user_id, username, user_id, user_id, user_id, user_id), fetch_one=True)


        if not profile:
            return jsonify({'status': 'error', 'message': 'Profile not found'}), 404
        
        profile_views_service = ProfileViewsService()
        profile_views_service.log_profile_view(user_id, profile['user_id'])

        logger.info("HERE!!!")

        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        logger.info(f"Error retrieving user data: {str(e)}")
        return jsonify({'status': 'error', 'message': "Something went wrong"}), 500
    

def get_profile_service(user_id):
    try:
        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

        select_query = """
            SELECT
                u.id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                u.gender,
                u.bio,
                u.birth_date,
                ST_X(ST_AsText(u.geolocation)) AS longitude,
                ST_Y(ST_AsText(u.geolocation)) AS latitude,
                ARRAY_AGG (i.id) AS interests
            FROM users u
            LEFT JOIN 
                user_interests ui ON u.id = ui.user_id
            LEFT JOIN 
                interests i ON ui.interest_id = i.id
            WHERE u.id = %s
            GROUP BY u.id
        """
        profile = execute_query(select_query, params=(user_id,), fetch_one=True)

        # tags_query = f"""
        #     SELECT interest_id
        #     FROM user_interests 
        #     WHERE user_id = %s;
        # """
        # tags = execute_query(tags_query, params=(user_id,), fetch_all=True)
        # result = [item["interest_id"] for item in tags]
        # profile['tags'] = result

        profile['birth_date'] = (
            profile['birth_date'].strftime('%Y-%m-%d') if profile['birth_date'] else ''
        )

        profile['gender'] = (True) if profile.get('gender', None) == 'Male' else (False)

        profile_query = "SELECT * FROM pictures WHERE user_id = %s AND is_profile = TRUE;"
        image = execute_query(profile_query, params=(user_id,), fetch_one=True)
        if image:
            profile['file_name'] = image.get('file_name')

        images_query = "SELECT * FROM pictures WHERE user_id = %s AND is_profile = FALSE;"
        images = execute_query(images_query, params=(user_id,), fetch_all=True)
        
        if images:
            images_names = [item['file_name'] for item in images]
            profile['images_name'] = images_names


        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        logger.info(f"Error retrieving notifications: {str(e)}")
        return jsonify({'status': 'error', 'message': "something went wrong"}), 500
    
#TODO CHANGE VALUES TO ALL DATA
def update_profile_service(data, user):
    try:
        user_id = user.get('id', None)
        
        # return jsonify({'message': "This username already exist"}), 403
        gender = '\'Male\'' if data.get('gender') else '\'Female\''
        update_query = f"""
            UPDATE users 
            SET
                first_name = %s ,
                last_name = %s ,
                email = %s ,
                username = %s ,
                bio = %s ,
                gender = {gender},
                birth_date = %s ,
                geolocation = ST_Point(%s, %s),
                is_complete = TRUE
            WHERE id = %s
        """
        execute_query(update_query, params=(data.get('first_name'), data.get('last_name'), data.get('email'), data.get('username'), data.get('bio'), data.get('birth_date'), data.get('latitude'), data.get('longitude'), str(user_id)))
        
        delete_query = """
                DELETE FROM user_interests
                WHERE user_id = %s;
            """
        execute_query(delete_query, params=(user_id,))

        if data.get('interests', None):
            insert_query = f"""
                INSERT INTO user_interests (user_id, interest_id)
                VALUES {f'({user_id}, %s), ' * (len(data['interests']) -1)} {(f'({user_id}, %s)')};
            """
            execute_query(insert_query, params=tuple(data['interests']))


        access_token = create_custom_access_token(identity={
            "id": user_id,
            "email": data.get('email'),
            "username": data.get('username', None),
            "is_verified": True,
            "is_complete": True,
        })
        return jsonify(access_token=access_token), 200
    except UniqueConstraintError as e:
        return jsonify({
            "status": "error",
            "message": f"{e.field} already exists",
        }), 409
    except Exception as e:
        logger.info(f"Error updating user: {str(e)}")
        return jsonify({'message': "something went wrong"}), 500

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
        unique_filename = f"{username}_{user_id}_profile{file_extension}"
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
        # existing_file = execute_query(select_query, params=(user_id,), fetch_all=True)
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
            unique_filename = f"{username}_{user_id}_{file_key}{file_extension}"
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
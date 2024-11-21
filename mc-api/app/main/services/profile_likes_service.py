from app.db.sql_executor import execute_query
from app.main.utils.exceptions import UniqueConstraintError
from flask import jsonify
from loguru import logger


class ProfilelikesService():


    def liked_profiles(self, user_id):
        try:
            select_query = "SELECT * FROM profile_likes WHERE liker_id = %s"
            users = execute_query(select_query, params=(user_id, ),fetch_all=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching liked users: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching liked users'}), 500
    

    def like_profile(self, liker_id, liked_profile_id):
        try:
            if liker_id == liked_profile_id:
                return jsonify({
                    "status": "error",
                    "message": "You cannot like your own profile."
                }), 400
            insert_query = "INSERT INTO profile_likes (liker_id, liked_profile_id) VALUES (%s, %s)"
            execute_query(insert_query, params=(liker_id, liked_profile_id))
            return jsonify({"status": "success", "message": "Profile liked successfully"}), 200
        except UniqueConstraintError as e:
            logger.error(f"warning liking user: {e}")
            return jsonify({
                "status": "error",
                "message": "you already liked this profile"
            }), 409
        except Exception as e:
            logger.error(f"Error liking user: {e}")
            return jsonify({'status': 'error', 'message': 'Error liking user'}), 500


    def unlike_profile(self, unliker_id, unliked_profile_id):
        try:
            if unliker_id == unliked_profile_id:
                return jsonify({
                "status": "error",
                "message": "You cannot unlike your own profile."
            }), 400
            delete_query = """
            DELETE FROM profile_likes
            WHERE liker_id = %s AND liked_profile_id = %s
            """
            execute_query(delete_query, params=(unliker_id, unliked_profile_id))
            return jsonify({"status": "success", "message": "Profile unliked successfully"}), 200
        except Exception as e:
            logger.error(f"Error unliking user: {e}")
            return jsonify({'status': 'error', 'message': 'Error unliking user'}), 500

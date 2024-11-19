from app.db.sql_executor import execute_query
from app.main.utils.exceptions import UniqueConstraintError
from flask import jsonify
from loguru import logger


class ProfilelikesService():


    def like_user(self, liker_id, liked_profile_id):
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


    def unlike_user(self, unliker_id, unliked_profile_id):
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

from app.db.sql_executor import execute_query
from app.main.utils.exceptions import UniqueConstraintError
from app.main.services.notification_service import create_notif_service
from flask import jsonify
from loguru import logger
from datetime import datetime, timezone
import humanize


class ProfilelikesService():


    def liked_profiles(self, user_id):
        try:
            select_query = "SELECT * FROM profile_likes WHERE liker_id = %s ORDER BY liked_at DESC"
            favories = execute_query(select_query, params=(user_id, ),fetch_all=True)


            formatted_favories = []
            for favorie in favories:
                select_query = "SELECT * FROM users WHERE ID = %s"
                user = execute_query(select_query, params=(favorie.get('liked_profile_id'),), fetch_one=True)
                favorie_time = favorie.get('liked_at')
                if favorie_time.tzinfo is None:
                    favorie_time = favorie_time.replace(tzinfo=timezone.utc)
                formatted_favories.append({
                    'username': user.get('username'),
                    'userPicture': 'https://randomuser.me/api/portraits/men/32.jpg', # TODO GET THE PICTURE FROM USER PITURES
                    'time': humanize.naturaltime(
                        datetime.now(timezone.utc) - favorie_time
                    ),
                })

            # return jsonify(users), 200
            return jsonify({'status': 'success', 'data': formatted_favories}), 200
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
            select_query = "SELECT EXISTS ( SELECT 1 FROM profile_likes WHERE liker_id = %s AND liked_profile_id = %s)"
            liked_before =execute_query(select_query, params=(liked_profile_id, liker_id), fetch_one=True)

            create_notif_service({"notified_user_id": liked_profile_id, "actor_id": liker_id, "type": 'macth' if (liked_before) else 'like'})

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
            create_notif_service({"notified_user_id": unliked_profile_id, "actor_id": unliker_id, "type": 'unlike'})
            return jsonify({"status": "success", "message": "Profile unliked successfully"}), 200
        except Exception as e:
            logger.error(f"Error unliking user: {e}")
            return jsonify({'status': 'error', 'message': 'Error unliking user'}), 500

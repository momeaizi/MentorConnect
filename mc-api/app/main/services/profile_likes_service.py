from app.db.sql_executor import execute_query
from app.main.utils.exceptions import UniqueConstraintError
from app.main.services.notification_service import create_notif_service
from app.main.services.chat_service import create_conversation_service
from app.main.services.user_block_service import is_user_blocked
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
                    'userPicture': user.get('picture_name'),
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
            
            if is_user_blocked(liker_id, liked_profile_id):
                return jsonify({
                    "status": "error",
                    "message": "You cannot like your this profile."
                }), 403


            query = """
                BEGIN;

                -- Remove profile like
                DELETE FROM profile_removed_likes
                WHERE liker_id = %s AND liked_profile_id = %s;


                -- Add profile like
                INSERT INTO profile_likes
                (liker_id, liked_profile_id) VALUES (%s, %s);


                COMMIT;
            """
            execute_query(query, params=(liker_id, liked_profile_id, liker_id, liked_profile_id))
            select_query = "SELECT EXISTS ( SELECT 1 FROM profile_likes WHERE liker_id = %s AND liked_profile_id = %s)"
            liked_before =execute_query(select_query, params=(liked_profile_id, liker_id), fetch_one=True)

            if liked_before.get('exists', None):
                create_conversation_service({'user_id_1': liker_id,'user_id_2': liked_profile_id})

            create_notif_service({"notified_user_id": liked_profile_id, "actor_id": liker_id, "type": 'match' if (liked_before.get('exists', None)) else 'like'})

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


            if is_user_blocked(unliker_id, unliked_profile_id):
                return jsonify({
                    "status": "error",
                    "message": "You cannot unlike your this profile."
                }), 403

            query = """
                BEGIN;

                -- Remove profile likes between the two users
                DELETE FROM profile_likes
                WHERE liker_id = %s AND liked_profile_id = %s;


                -- Add profile removed likes
                INSERT INTO profile_removed_likes
                (liker_id, liked_profile_id) VALUES (%s, %s);

                -- Remove conversations between the two users
                DELETE FROM conversations
                WHERE (user_id_1 = %s AND user_id_2 = %s)
                OR (user_id_1 = %s AND user_id_2 = %s);

                COMMIT;
            """
            execute_query(query, params=(unliker_id, unliked_profile_id, unliker_id, unliked_profile_id, unliker_id, unliked_profile_id, unliked_profile_id, unliker_id))
            create_notif_service({"notified_user_id": unliked_profile_id, "actor_id": unliker_id, "type": 'unliked'})
            return jsonify({"status": "success", "message": "Profile unliked successfully"}), 200
        except Exception as e:
            logger.error(f"Error unliking user: {e}")
            return jsonify({'status': 'error', 'message': 'Error unliking user'}), 500

from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify


class UserBlockService:
    def block_user(self, blocker_id, blocked_id):
        try:
            insert_query = f"INSERT INTO blocked_users (blocker_id, blocked_id) VALUES (%s, %s)"
            execute_query(insert_query, params=(blocker_id, blocked_id))
            query = """
                BEGIN;

                -- Remove profile views between the two users
                DELETE FROM profile_views
                WHERE (viewer_id = %s AND profile_owner_id = %s)
                OR (viewer_id = %s AND profile_owner_id = %s);

                -- Remove profile likes between the two users
                DELETE FROM profile_likes
                WHERE (liker_id = %s AND liked_profile_id = %s)
                OR (liker_id = %s AND liked_profile_id = %s);

                -- Remove conversations between the two users
                DELETE FROM conversations
                WHERE (user_id_1 = %s AND user_id_2 = %s)
                OR (user_id_1 = %s AND user_id_2 = %s);

                -- Remove messages related to conversations between the two users
                DELETE FROM messages
                WHERE conversation_id IN (
                    SELECT id
                    FROM conversations
                    WHERE (user_id_1 = %s AND user_id_2 = %s)
                    OR (user_id_1 = %s AND user_id_2 = %s)
                );

                -- Remove mutual notifications between the two users
                DELETE FROM notifications
                WHERE (notified_user_id = %s AND actor_id = %s)
                OR (notified_user_id = %s AND actor_id = %s);

                COMMIT;
            """

            execute_query(query, params=(blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id))

            return jsonify({'status': 'success', 'message': 'user blocked successfully'}), 200
        except UniqueConstraintError as e:
            logger.error(f"warning blocking user: {e}")
            return jsonify({
                "status": "error",
                "message": "user already blocked"
            }), 403
        except Exception as e:
            logger.error(f"Error blocking user: {e}")
            return jsonify({'status': 'error', 'message': 'Error blocking user'}), 500
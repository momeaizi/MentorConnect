from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify


def is_user_blocked(user1_id, user2_id):
    """
    Checks if either user1 has blocked user2 or user2 has blocked user1.

    Args:
        user1_id (int): The ID of the first user.
        user2_id (int): The ID of the second user.

    Returns:
        bool: True if one of the users has blocked the other, False otherwise.
    """
    try:
        query = """
            SELECT EXISTS (
                SELECT 1 
                FROM blocked_users 
                WHERE 
                    (blocker_id = %s AND blocked_id = %s)
                    OR (blocker_id = %s AND blocked_id = %s)
            );
        """
        result = execute_query(query, (user1_id, user2_id, user2_id, user1_id), fetch_one=True)
        return result.get('exists', False)
    except Exception as e:
        logger.error(f"Error checking blocked status: {e}")
        return False


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

                -- Remove mutual notifications between the two users
                DELETE FROM notifications
                WHERE (notified_user_id = %s AND actor_id = %s)
                OR (notified_user_id = %s AND actor_id = %s);

                COMMIT;
            """

            execute_query(query, params=(blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id, blocker_id, blocked_id, blocked_id, blocker_id))

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
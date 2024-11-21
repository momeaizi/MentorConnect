from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify


class UserBlockService:
    def block_user(self, blocker_id, blocked_id):
        try:
            insert_query = f"INSERT INTO blocked_users (blocker_id, blocked_id) VALUES (%s, %s)"
            execute_query(insert_query, params=(blocker_id, blocked_id))
            # remove conversation
            # remove from him likes
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
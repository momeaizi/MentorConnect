from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify
from app.main.services.user_block_service import UserBlockService


class UserReportService:
    def report_user(self, reporter_id, reported_id):
        try:
            insert_query = f"INSERT INTO reported_users (reporter_id, reported_id) VALUES (%s, %s)"
            execute_query(insert_query, params=(reporter_id, reported_id))

            user_block_service = UserBlockService()
            user_block_service.block_user(reporter_id, reported_id)

            return jsonify({'status': 'success', 'message': 'user reported as fake account successfully'}), 200
        except UniqueConstraintError as e:
            logger.error(f"warning reporting user: {e}")
            return jsonify({
                "status": "error",
                "message": "user already reported"
            }), 403
        except Exception as e:
            logger.error(f"Error reporting user: {e}")
            return jsonify({'status': 'error', 'message': 'Error reporting user'}), 500
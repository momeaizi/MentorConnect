from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify

class InterestsService:
    def fetch_interests(self):
        try:
            select_query = "SELECT * FROM interests"
            interests = execute_query(select_query ,fetch_all=True)
            return jsonify(interests), 200
        except Exception as e:
            logger.error(f"Error fetching interests: {e}")
            return jsonify({'message': 'Error fetching interests'}), 500

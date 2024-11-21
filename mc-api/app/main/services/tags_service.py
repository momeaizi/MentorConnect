from flask import jsonify
from app.db.sql_executor import execute_query
from loguru import logger

class TagService:
    def get_all_tags(self):
        try:
            select_query = "SELECT id, name FROM tags"

            tags = execute_query(select_query, fetch_all=True)
            
            return jsonify(tags), 200
        except Exception as e:
            logger.error(f"Error fetching tags: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching tags'}), 500

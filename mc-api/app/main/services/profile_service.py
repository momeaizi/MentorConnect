from flask import Blueprint, request, jsonify
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError


def get_profile_service(user_id):
    try:
        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

        select_query = "SELECT * FROM users WHERE id = %s"
        profile = execute_query(select_query, params=(user_id), fetch_one=True)
        return jsonify({'status': 'success', 'data': profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving notifications: {str(e)}"}), 500
    
def update_profile_service(data):
    try:
        update_query = f"UPDATE users  ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        updated_profile = execute_query(update_query, params=tuple(data.values()))


        return jsonify({'status': 'success', 'message': updated_profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error deleting conversation: {str(e)}"}), 500


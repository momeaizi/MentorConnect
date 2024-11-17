from flask import Blueprint, request, jsonify
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError

chat_bp = Blueprint('chat_bp', __name__)

# data: { user_id_1,user_id_2,last_message_id}
@chat_bp.route('/conversation', methods=['POST'])
@token_required
def create_conversation():
    data = request.json
    try:
        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("user_id_1", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id_1. User does not exist.'}), 400
        
        user_exists = execute_query(validate_query, params=(data.get("user_id_1", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id_1. User does not exist.'}), 400
        
        insert_query = f"INSERT INTO conversations ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        return jsonify({'status': 'success', 'message': 'Conversation created successfully'}), 201

    except Exception as e:
        logger.error()
        return jsonify({'status': 'error', 'message': f"Failed to create conversation: {str(e)}"}), 500

@chat_bp.route('/conversation',)
@token_required
def get_conv_with_user_id(user):
    try:
        user_id = user.get('id', None)

        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

        select_query = "SELECT * FROM conversations WHERE user_id_1 = %s OR user_id_2 = %s"

        conversations = execute_query(select_query, params=(user_id, user_id), fetch_all=True)
        return jsonify({'status': 'success', 'data': conversations}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving notifications: {str(e)}"}), 500


    
@chat_bp.route('/conversation/<conv_id>', methods=['GET'])
@token_required
def get_conv_with_conv_id(conv_id, user):
    try:
        select_conversation_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_conversation_query, params=(conv_id,), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Invalid conversation ID. This conversation does not exist."}), 404

        select_messages_query = """SELECT * FROM messages WHERE conversation_id = %s ORDER BY created_at ASC"""
        messages = execute_query(select_messages_query, params=(conv_id,), fetch_all=True)

        return jsonify({
            'status': 'success',
            'data': {
                'conversation': conversation,
                'messages': messages
            }}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving conversation: {str(e)}"}), 500


@chat_bp.route('/conversation/<conv_id>', methods=['DELETE'])
@token_required
def delete_conversation(conv_id, user):
    try:
        select_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_query, params=(conv_id,), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Conversation not found."}), 404

        delete_query = "DELETE FROM conversations WHERE id = %s"
        execute_query(delete_query, params=(conv_id,))

        return jsonify({'status': 'success', 'message': 'Conversation and its messages have been deleted.'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error deleting conversation: {str(e)}"}), 500

@chat_bp.route('/conversation/<conv_id>', methods=['PATCH'])
@token_required
def update_conversation(conv_id, user):
    try:
        select_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_query, params=(conv_id,), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Conversation not found."}), 404

        delete_query = "UPDATE conversations SET see = TRUE WHERE id = %s"
        execute_query(delete_query, params=(conv_id,))
        return jsonify({'status': 'success', 'message': 'Conversation and its messages have been deleted.'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error deleting conversation: {str(e)}"}), 500

# data : {conversation_id, user_id, message}
@chat_bp.route('/message', methods=['POST'])
@token_required
def create_message(user):
    data = request.json
    try:
        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("user_id", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id. User does not exist.'}), 400
        
        select_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_query, params=(data.get('conversation_id', None),), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Conversation not found."}), 404

        
        insert_query = f"INSERT INTO messages ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        return jsonify({'status': 'success', 'message': 'Message created successfully'}), 201

    except Exception as e:
        logger.error()
        return jsonify({'status': 'error', 'message': f"Failed to create conversation: {str(e)}"}), 500
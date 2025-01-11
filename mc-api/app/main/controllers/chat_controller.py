from flask import Blueprint, request, jsonify
from loguru import logger
from app.db.sql_executor import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from app.main.services.chat_service import (
    create_conversation_service, get_conv_with_user_id_service,
    get_conv_with_conv_id_service, delete_conversation_service,
    create_message_service, number_of_chat_service
)

chat_bp = Blueprint('chat_bp', __name__)

# data: { user_id_1,user_id_2}
# TODO ADD DTO
#? CREATE NEW CONVERSATION
@chat_bp.route('/conversation', methods=['POST'])
# @token_required
def create_conversation():
    logger.info("+++++++++++++++++++++")
    user = {"id":1}
    data = request.json
    if not data:
        logger.error("No data received")
        return jsonify({"error": "No data provided"}), 400
    
    try:
        return create_conversation_service(data,)

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#? GET THE CONVERSATIONS OF USER
@chat_bp.route('/conversation',methods=['GET'])
@token_required
def get_conv_with_user_id(user):
    user_id = user.get('id', None)
    return get_conv_with_user_id_service(user_id)

# def get_conv_with_user_id():
#     user = {'id':1}

#? GET A CONVERSTION
@chat_bp.route('/conversation/<conv_id>', methods=['GET'])
@token_required
def get_conv_with_conv_id(conv_id, user):
    user_id = user.get('id', None)
    return get_conv_with_conv_id_service(conv_id, user_id)


#? DELETE A CONVERSTION
@chat_bp.route('/conversation/<conv_id>', methods=['DELETE'])
@token_required
def delete_conversation(conv_id, user):
    return delete_conversation_service(conv_id)

#! WE ADD THIS FEATURE TO GET CONV
@chat_bp.route('/conversation/<conv_id>', methods=['PATCH'])
@token_required
def update_conversation(conv_id, user):
    try:
        select_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_query, params=(conv_id,), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Conversation not found."}), 404

        return jsonify({'status': 'success', 'message': 'Conversation and its messages have been deleted.'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error deleting conversation: {str(e)}"}), 500

# data : {conversation_id, user_id, message}
@chat_bp.route('/message', methods=['POST'])
# @token_required
def create_message():
    data = request.json
    return create_message_service(data)


@chat_bp.route('/number')
@token_required
def number_of_chat(user):
    return number_of_chat_service(user)
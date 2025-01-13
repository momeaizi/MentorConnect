from flask import Blueprint, request, jsonify
from loguru import logger
from app.db.sql_executor import execute_query
from app.main.utils.decorators import expect_dto, token_required
from app.main.utils.exceptions import ValidationError
from flask_socketio import emit
from app.main import socketio

def create_conversation_service(data):
    try:
        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("user_id_1", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id_1. User does not exist.'}), 400
        
        user_exists = execute_query(validate_query, params=(data.get("user_id_1", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id_1. User does not exist.'}), 400
        
        insert_query = f"INSERT INTO conversations ({', '.join(data.keys())}) VALUES (%s, %s) RETURNING *"
        new_conversation = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        return jsonify({'status': 'success', 'message': new_conversation}), 201

    except Exception as e:
        logger.error()
        return jsonify({'status': 'error', 'message': f"Failed to create conversation: {str(e)}"}), 500
    
def get_conv_with_user_id_service(user_id):
    try:
        query = """
            SELECT
                c.id AS conversation_id,
                u.first_name || ' ' || u.last_name AS name,
                u.username,
                u.email,
                u.is_logged_in,
                c.see AS is_seen,
                c.created_at AS conv_time,
                m.id AS last_message_id,
                m.message AS last_message_content,
                m.created_at AS last_message_time,
                m.user_id AS message_user_id 
            FROM conversations c
            JOIN users u 
                ON u.id = CASE 
                            WHEN c.user_id_1 = %s THEN c.user_id_2 
                            ELSE c.user_id_1 
                        END
            LEFT JOIN LATERAL (
                SELECT 
                    m.id,
                    m.message,
                    m.created_at,
                    m.user_id 
                FROM messages m
                WHERE m.conversation_id = c.id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) m ON TRUE
            WHERE c.user_id_1 = %s OR c.user_id_2 = %s
            ORDER BY c.created_at DESC;
        """

        conversations = execute_query(query, params=(user_id, user_id, user_id), fetch_all=True)

        result = [
            {
                "id": conv["conversation_id"],
                "user_id":conv["message_user_id"],
                "name": conv["username"],# change username with name
                "lastMessage": conv["last_message_content"] or "", 
                "time": conv["last_message_time"].strftime("%I:%M%p") if conv.get("last_message_time") else conv["conv_time"].strftime("%I:%M%p") if conv.get("conv_time") else "",
                "isSeen": conv["is_seen"],
                "image": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            }
            for conv in conversations
        ]


        return jsonify({"status": "success", "data": result}), 200

    except Exception as e:
        logger.error(f"Failed to retrieve conversation data: {str(e)}")
        return jsonify({'status': 'error', 'message': f"Error: {str(e)}"}), 500


def get_conv_with_conv_id_service(conv_id, user_id):
    try:
        select_conversation_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_conversation_query, params=(conv_id,), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Invalid conversation ID. This conversation does not exist."}), 404

        select_messages_query = """SELECT * FROM messages WHERE conversation_id = %s ORDER BY created_at ASC"""
        messages = execute_query(select_messages_query, params=(conv_id,), fetch_all=True)
        last_message = None
        if messages:
            last_message = messages[-1]
        
        logger.info("_____________________________________________")
        logger.info(user_id)
        logger.info(last_message)
        logger.info("_____________________________________________")
        if messages and user_id != last_message.get('user_id', None):
            logger.info("******************")
            update_query = "UPDATE conversations SET see = TRUE WHERE id = %s RETURNING *"
            execute_query(update_query, params=(last_message.get('conversation_id', None),))
            conversation = execute_query(select_conversation_query, params=(conv_id,), fetch_one=True)
            logger.info(f"=======> {conversation}")

        select_user_query = "SELECT * FROM users WHERE id = %s"

        user = execute_query(select_user_query, params=(str(conversation['user_id_2']) if conversation['user_id_1'] == user_id else str(conversation['user_id_1']) ,), fetch_one=True)

        new_conversation = {
            "image": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
            "name": user['username'],
            "is_logged_in": user['is_logged_in'],
            "id": user['id']
        }
        
        return jsonify({
            'status': 'success',
            'data': {
                'conversation': new_conversation,
                'messages': messages
            }}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"Error retrieving conversation: {str(e)}"}), 500

def delete_conversation_service(conv_id):
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

# data : {conversation_id, user_id, message}
def create_message_service(data):
    try:
        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("user_id", None),), fetch_one=True)
        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid user_id. User does not exist.'}), 400
        
        select_query = "SELECT * FROM conversations WHERE id = %s"
        conversation = execute_query(select_query, params=(data.get('conversation_id', None),), fetch_one=True)

        if not conversation:
            return jsonify({'status': 'error', 'message': "Conversation not found."}), 404

        logger.info(conversation)

        insert_query = f"INSERT INTO messages ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        new_message = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        logger.info(new_message)
        # created_at
        update_query = "UPDATE conversations SET created_at = %s, last_message_id = %s, see = FALSE WHERE id = %s"
        execute_query(update_query, params=(new_message['created_at'], new_message['id'], new_message['conversation_id']))
        send_message = {
            'message':new_message['message'],
            'user_id': new_message['user_id'],
            'conv_id': new_message['conversation_id']
        }
        
        socketio.emit('new_message', send_message, namespace='/',  room=f"room_{conversation.get('user_id_1')}")
        socketio.emit('new_message', send_message, namespace='/',  room=f"room_{conversation.get('user_id_2')}")
        
        return jsonify({'status': 'success', 'message': 'Message created successfully'}), 201

    except Exception as e:
        logger.error()
        return jsonify({'status': 'error', 'message': f"Failed to create conversation: {str(e)}"}), 500
    

def number_of_chat_service(user):
    user_id = user.get('id', None)

    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        select_query = """SELECT COUNT(*)
                FROM conversations c
                JOIN messages m ON c.last_message_id = m.id
                WHERE (c.user_id_1 = %s OR c.user_id_2 = %s)
                AND c.see = FALSE
                AND m.user_id != %s;
            """
        
        result = execute_query(select_query, params=(user_id,user_id,user_id,), fetch_all=True)

        chat_count = result[0].get('count', None) if result else 0

        return jsonify({'status': 'success', 'number': chat_count}), 200

    except Exception as e:
        logger.error(f"Error retrieving chat: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch chat. Please try again later.'}), 500


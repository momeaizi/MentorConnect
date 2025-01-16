from flask import jsonify, request
from datetime import datetime, timezone
from loguru import logger
import humanize
from app.db.sql_executor import execute_query
from app.main.services.socket_service import SocketService

socket_service = SocketService()


def can_send_notification(actor_id, notified_user_id) -> bool:
    """
    Checks if a notification can be sent based on the profile_removed_likes table.
    
    Args:
        liker_id (int): The ID of the user who might trigger the notification.
        liked_profile_id (int): The ID of the user who might receive the notification.
        connection: The psycopg2 database connection object.

    Returns:
        bool: True if the notification can be sent, False otherwise.
    """
    query = """
        SELECT EXISTS (
            SELECT 1 
            FROM profile_removed_likes
            WHERE liker_id = %s AND liked_profile_id = %s
        );
    """
    try:
        result = execute_query(query, params=(notified_user_id, actor_id), fetch_one=True)
        logger.info(not result.get('exists', None))
        return not result.get('exists', None)
    except Exception as e:
        logger.info(f"Error checking notification eligibility: {e}")
        return False


#{ notified_user_id, actor_id, type}
def create_notif_service(data):

    try:

        # if not can_send_notification(data.get('notified_user_id', None), data.get('actor_id', None)):
        #     return jsonify({'status': 'error', 'message': 'this profile has removed his like'}), 400

        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("notified_user_id", None),), fetch_one=True)

        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid notified_user_id. User does not exist.'}), 400

        insert_query = f"INSERT INTO notifications ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        notif = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)

        select_query = "SELECT * FROM users WHERE ID = %s"
        user = execute_query(select_query, params=(notif.get('actor_id'),), fetch_one=True)
        notification_time = notif.get('notification_time')
        if notification_time.tzinfo is None:
            notification_time = notification_time.replace(tzinfo=timezone.utc)

        new_notification= {
            'username': user.get('username'),
            'user_id':user.get('id'),
            'userPicture': user.get('picture_name'),
            'type': notif.get('type'),
            'time': humanize.naturaltime(
                datetime.now(timezone.utc) - notification_time
            ),
            'isRead': notif['is_seen']
        }
        socket_service.handle_new_notification(new_notification)

        logger.info(new_notification)

        return jsonify({'status': 'success', 'message': 'Notification created successfully'}), 201

    except Exception as e:
        logger.error(f"Failed to create notification: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


def get_notif_by_user_service(user):
    user_id = user.get('id', None)

    if not user_id:
        logger.error("User ID is missing in the request.")
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        select_query = "SELECT * FROM notifications WHERE notified_user_id = %s ORDER BY notification_time DESC"
        notifications = execute_query(select_query, params=(user_id,), fetch_all=True)


        formatted_notifications = []
        for notif in notifications:
            select_query = "SELECT * FROM users WHERE ID = %s"
            user = execute_query(select_query, params=(notif.get('actor_id'),), fetch_one=True)
            notification_time = notif.get('notification_time')
            if notification_time.tzinfo is None:
                notification_time = notification_time.replace(tzinfo=timezone.utc)
                    
            picture_query = "SELECT * FROM pictures WHERE user_id = %s AND is_profile = TRUE;"
            image = execute_query(picture_query, params=(user.get('id'),), fetch_one=True)
            file_name = ''
            if image:
                file_name = image.get('file_name')
            formatted_notifications.append({
                'username': user.get('username'),
                'userPicture': file_name,
                'type': notif.get('type'),
                'time': humanize.naturaltime(
                    datetime.now(timezone.utc) - notification_time
                ),
                'isRead': notif['is_seen']
            })

        # logger.info(formatted_notifications)
        see_notification_service(user_id)
        return jsonify({'status': 'success', 'data': formatted_notifications}), 200

    except Exception as e:
        logger.error(f"Error retrieving notifications: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch notifications. Please try again later.'}), 500


def see_notification_service(user_id):

    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        update_query = """
            UPDATE notifications
            SET is_seen = TRUE
            WHERE notified_user_id = %s
            RETURNING *
        """
        execute_query(update_query, params=(user_id,), fetch_all=True)

        return jsonify({'status': 'success', 'message': "notification is updated"}), 200

    except Exception as e:
        logger.error(f"Error marking notification(s) as seen: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to update notifications.'}), 500

def number_of_notification_service(user):
    user_id = user.get('id', None)

    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        select_query = "SELECT COUNT(*) FROM notifications WHERE notified_user_id = %s AND is_seen = FALSE"
        result = execute_query(select_query, params=(user_id,), fetch_all=True)
        
        notification_count = result[0].get('count', None) if result else 0

        return jsonify({'status': 'success', 'number': notification_count}), 200

    except Exception as e:
        logger.error(f"Error retrieving notifications: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch notifications. Please try again later.'}), 500


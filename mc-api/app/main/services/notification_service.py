from flask import jsonify, request
from loguru import logger
from app.db.sql_executor import execute_query

#{ notified_user_id, actor_id, type}
def create_notif_service(data):
    try:
        validate_query = "SELECT 1 FROM users WHERE id = %s"
        user_exists = execute_query(validate_query, params=(data.get("notified_user_id", None),), fetch_one=True)

        if not user_exists:
            return jsonify({'status': 'error', 'message': 'Invalid notified_user_id. User does not exist.'}), 400

        insert_query = f"INSERT INTO notifications ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        return jsonify({'status': 'success', 'message': 'Notification created successfully'}), 201

    except Exception as e:
        logger.error(f"Failed to create notification: {str(e)}")
        return jsonify({'status': 'error', 'message': 'An error occurred while creating the notification.'}), 500


def get_notif_by_user_service(user):
    user_id = user.get('id', None)

    if not user_id:
        logger.error("User ID is missing in the request.")
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        select_query = "SELECT * FROM notifications WHERE notified_user_id = %s"
        notifications = execute_query(select_query, params=(user_id,), fetch_all=True)

        logger.info(f"Notifications retrieved: {notifications}")
        return jsonify({'status': 'success', 'data': notifications}), 200

    except Exception as e:
        logger.error(f"Error retrieving notifications: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch notifications. Please try again later.'}), 500


def see_notification_service(user):
    user_id = user.get('id')

    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID is required.'}), 400

    try:
        update_query = """
            UPDATE notifications
            SET is_seen = TRUE
            WHERE notified_user_id = %s
            RETURNING *
        """
        params = (user_id,)
        execute_query(update_query, params=params, fetch_all=True)

        return jsonify({'status': 'success', 'message': "notification is updated"}), 200

    except Exception as e:
        logger.error(f"Error marking notification(s) as seen: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to update notifications.'}), 500


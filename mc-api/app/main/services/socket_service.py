from flask import request
from flask_socketio import emit, join_room
from app.main import redis_client
from app.main.services.users_service import UserService
from datetime import datetime
from loguru import logger


user_service = UserService()


class SocketService:
    def handle_connect(self, user):
        logger.info(f"connected: {request.sid}")

        user_id = user.get('id')

        room = f"room_{user_id}"

        redis_client.incr(f"room:{room}:user_count")
        join_room(room)

        count = int(redis_client.get(f"room:{room}:user_count") or 0)

        if int(count) == 1:
            user_service.set_user_logged_in(user_id)
        emit('status', {"user_id": user_id, "is_logged_in": True}, broadcast=True)


    def handle_new_notification(self, notified_user_id, notification_data):
        if isinstance(notification_data.get('notification_time'), datetime):
            notification_data['notification_time'] = notification_data['notification_time'].isoformat()
        emit('new_notification', notification_data, namespace='/', room=f"room_{notified_user_id}")


    def handle_disconnect(self, user):
        logger.info(f"disconnected: {request.sid}")

        user_id = user.get('id')

        room = f"room_{user_id}"

        if redis_client.exists(f"room:{room}:user_count"):
            redis_client.decr(f"room:{room}:user_count")



        count = int(redis_client.get(f"room:{room}:user_count") or 0)
        emit('status', {"user_id": user_id, "is_logged_in": False}, broadcast=True)

        if count == 0:
            user_service.set_user_logged_out(user_id)

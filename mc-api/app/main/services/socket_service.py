from flask import request
from flask_socketio import emit, join_room
from app.main import redis_client
from app.main.services.users_service import UserService
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
            user_service.set_user_logged_in(1)
        emit('status', {"user_id": 1, "is_online": True, "count": int(count)}, broadcast=True)



    def handle_disconnect(self, user):
        logger.info(f"disconnected: {request.sid}")

        user_id = user.get('id')

        room = f"room_{user_id}"

        if redis_client.exists(f"room:{room}:user_count"):
            redis_client.decr(f"room:{room}:user_count")



        count = int(redis_client.get(f"room:{room}:user_count") or 0)
        emit('status', {"user_id": 1, "is_online": False, "count": int(count)}, broadcast=True)

        if count == 0:
            user_service.set_user_logged_out(1)
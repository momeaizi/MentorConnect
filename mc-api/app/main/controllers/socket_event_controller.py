from app.main import socketio
from app.main.services.socket_service import SocketService


socket_service = SocketService()


@socketio.on('connect')
def handle_connect():
    socket_service.handle_connect({"id": 1})


@socketio.on('disconnect')
def handle_disconnect():
    socket_service.handle_disconnect({"id": 1})

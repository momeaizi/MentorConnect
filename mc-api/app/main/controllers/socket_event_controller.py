from app.main import socketio
from app.main.services.socket_service import SocketService
from app.main.utils.decorators import socket_token_required

socket_service = SocketService()


@socketio.on('connect')
@socket_token_required
def handle_connect(user):
    socket_service.handle_connect(user)

@socketio.on('disconnect')
@socket_token_required
def handle_disconnect(user):
    socket_service.handle_disconnect(user)

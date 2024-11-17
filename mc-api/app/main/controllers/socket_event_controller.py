from flask_socketio import SocketIO, join_room, leave_room
from app.main import socketio
from flask import request
# from app.main.services.socket_service import SocketService

# Initialize the socket service
# socket_service = SocketService(socketio=None)  # socketio will be passed during app initialization

# Handling socket connection
@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')  # Retrieve user ID from query params
    sid = request.sid  # Get the socket ID of the client
    pass
    # socket_service.handle_user_connect(user_id, sid)

# Handling socket disconnection
@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    pass
    # socket_service.handle_user_disconnect(sid)

# Handling send notification event
@socketio.on('send_notification')
def handle_send_notification(data):
    recipient_id = data['recipient_id']
    message = data['message']
    pass
    # socket_service.send_notification(recipient_id, message)

# Handling send chat message event
@socketio.on('send_message')
def handle_send_message(data):
    sender_id = data['sender_id']
    recipient_id = data['recipient_id']
    message = data['message']
    pass
    # socket_service.send_message(sender_id, recipient_id, message)

# from flask_socketio import 
from flask_socketio import emit
from app.main import socketio
from flask import request
from loguru import logger

# Initialize the socket service
# socket_service = SocketService(socketio=None)  # socketio will be passed during app initialization

# Handling socket connection
@socketio.on('connect')
def handle_connect():
    # user_id = request.args.get('user_id')
    return False
    logger.info(request.headers)
    emit('hamid', {"name": "taha"}, to=request.sid)
    
    # socket_service.handle_user_connect(user_id, sid)

# Handling socket disconnection
@socketio.on('disconnect')
def handle_disconnect():
    logger.info(request.headers)
    sid = request.sid

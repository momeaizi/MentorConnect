from app.main.controllers.users_controller import user_bp
from app.main.controllers.profiles_controller import profile_bp
from app.main.controllers.auth_controller import auth_bp
from app.main.controllers.user_block_controller import user_block_bp
from app.main.controllers.user_report_controller import user_report_bp
from app.main.controllers.notification_controller import notification_bp
from app.main.controllers.chat_controller import chat_bp
from app.main.controllers.tags_controller import tags_bp
from app.main.controllers.socket_event_controller import *


def init_controllers(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notification_bp, url_prefix='/api/notif')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(user_block_bp, url_prefix='/api/users')
    app.register_blueprint(user_report_bp, url_prefix='/api/users')
    app.register_blueprint(profile_bp, url_prefix='/api/profiles')
    app.register_blueprint(tags_bp, url_prefix='/api/tags')

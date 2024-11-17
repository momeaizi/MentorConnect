from app.main.controllers.user_controller import user_bp
from app.main.controllers.auth_controller import auth_bp
from app.main.controllers.notification_controller import notification_bp

def init_controllers(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notification_bp, url_prefix='/api/notif)

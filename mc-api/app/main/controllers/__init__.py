from app.main.controllers.users_controller import user_bp
from app.main.controllers.profiles_controller import profile_bp


def init_controllers(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(profile_bp, url_prefix='/api/profiles')

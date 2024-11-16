from app.main.controllers.user_controller import user_bp
from app.main.controllers.profile_views_controller import profile_views_bp

def init_controllers(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(profile_views_bp, url_prefix='/api/profile-views')

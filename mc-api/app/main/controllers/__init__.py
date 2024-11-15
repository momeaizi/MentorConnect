from app.main.controllers.users_controller import user_bp

def init_controllers(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')

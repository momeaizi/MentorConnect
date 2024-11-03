from app.controllers.hello_world_controller import user_bp

def init_controllers(app):
    app.register_blueprint(user_bp, url_prefix='/api/users')

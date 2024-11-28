from flask import Flask
from app.main.config import config_by_name
from loguru import logger
from app.db.postgres_db_connection import PostgresDBConnection
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask_socketio import SocketIO
import redis
from flask_cors import CORS


postgres_db_connection = PostgresDBConnection()
bcrypt = Bcrypt() 
mail = Mail()
socketio = SocketIO()
redis_client = None

def create_app(config_name):


    global redis_client




    logger.info("App is starting on : " + config_name + " mode")
    app = Flask(__name__)

    CORS(app)

    app.config.from_object(config_by_name[config_name])

    redis_url = app.config.get('REDIS_URL')

    postgres_db_connection.init_db(app.config)
    bcrypt.init_app(app)
    mail.init_app(app)
    socketio.init_app(app, message_queue=redis_url)
    # redis_client = redis.StrictRedis.from_url(redis_url, decode_responses=True)

    
    from app.main.controllers import init_controllers
    init_controllers(app)

    return app
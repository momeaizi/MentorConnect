from flask import Flask
from app.main.config import config_by_name
from loguru import logger
from app.main.controllers import init_controllers
from app.db import PostgresDBConnection

postgres_db_connection = PostgresDBConnection()

def create_app(config_name):
    logger.info("App is starting on : " + config_name + " mode")
    app = Flask(__name__)

    app.config.from_object(config_by_name[config_name])
    
    postgres_db_connection.init_db(app.config)

    init_controllers(app)

    return app
from flask import Flask
from app.config import config_by_name
from loguru import logger
from app.controllers import init_controllers

def create_app(config_name):
    logger.info("App is starting on : " + config_name + " mode")
    app = Flask(__name__)

    app.config.from_object(config_by_name[config_name])


    #register controllers
    init_controllers(app)

    return app
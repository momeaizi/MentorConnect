import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DB_HOST = os.getenv('DB_HOST')
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_PORT = os.getenv('DB_PORT')
    REDIS_URL = os.getenv('REDIS_URL')
    JWT_PRIVATE_KEY = 'your-very-secret-private-key'
    JWT_ALGORITHM = 'HS256'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'mentorconnect682@gmail.com'
    MAIL_DEFAULT_SENDER = 'mentorconnect682@gmail.com'
    MAIL_PASSWORD = 'juhu nfbk ubul otdh'
    UPLOAD_FOLDER = os.path.abspath('./uploads')
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config_by_name = dict(dev=DevelopmentConfig, prod=ProductionConfig)



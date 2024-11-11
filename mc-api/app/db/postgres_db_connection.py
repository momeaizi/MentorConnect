from psycopg2 import pool
from .base_db_connection import BaseDBConnection
from loguru import logger


class PostgresDBConnection(BaseDBConnection):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(PostgresDBConnection, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'connection_pool'):
            self.connection_pool = None

    def init_db(self, config):
        try:
            self.connection_pool = pool.SimpleConnectionPool(
                minconn=1,
                maxconn=10,
                host=config.get('DB_HOST'),
                database=config.get('DB_NAME'),
                user=config.get('DB_USER'),
                password=config.get('DB_PASSWORD'),
                port=config.get('DB_PORT')
            )
            if self.connection_pool:
                logger.error("Connection pool created successfully")
        except Exception as e:
            logger.error(f"Error creating connection pool: {str(e)}")

    def get_db_connection(self):
        if self.connection_pool:
            return self.connection_pool.getconn()
        else:
            logger.error("Connection pool not initialized")
            return None

    def release_db_connection(self, conn):
        if self.connection_pool and conn:
            self.connection_pool.putconn(conn)

    def close_db(self):
        if self.connection_pool:
            self.connection_pool.closeall()

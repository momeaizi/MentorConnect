import time
from psycopg2 import pool, OperationalError
from loguru import logger


class PostgresDBConnection:
    def __init__(self):
        self.connection_pool = None

    def init_db(self, config, max_retries=5, initial_wait=2):
        retries = 0

        while retries < max_retries:
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
                    logger.info("Connection pool created successfully")
                    return

            except OperationalError as e:
                logger.error(f"Attempt {retries + 1}/{max_retries} - Error creating connection pool: {str(e)}")
                retries += 1
                if retries < max_retries:
                    wait_time = initial_wait * (2 ** (retries - 1))  # Exponential backoff
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    logger.error("Max retries reached. Exiting.")
                    exit(10)
            except Exception as e:
                logger.error(f"Error creating connection pool: {str(e)}")
                exit(10)

    def get_db_connection(self):
        if self.connection_pool:
            try:
                return self.connection_pool.getconn()
            except Exception as e:
                logger.error(f"Error getting connection from pool: {str(e)}")
                return None
        else:
            logger.error("Connection pool not initialized")
            return None

    def release_db_connection(self, conn):
        if self.connection_pool and conn:
            self.connection_pool.putconn(conn)

    def close_db(self):
        if self.connection_pool:
            self.connection_pool.closeall()
            logger.info("All connections in the pool have been closed")

import psycopg2.extras
from app.db import PostgresDBConnection
from loguru import logger


def get_user():
    postgres_db_connection = PostgresDBConnection()

    connection = postgres_db_connection.get_db_connection()

    if connection:
        try:
            with connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                cursor.execute("SELECT * FROM users;")
                users = cursor.fetchall()

                logger.info(f"Fetched {len(users)} users")

                return [dict(user) for user in users]
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
        finally:
            postgres_db_connection.release_db_connection(connection)
    else:
        logger.error("Failed to get a database connection.")
    
    return []

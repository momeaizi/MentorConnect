from app.db import PostgresDBConnection
from loguru import logger


def get_user():

    postgres_db_connection = PostgresDBConnection()

    connection = postgres_db_connection.get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50),
                    age INTEGER
                    )
                """)
                cursor.execute("""
                    INSERT INTO users (name, age)
                    VALUES ('Alice', 30), ('Bob', 25), ('Charlie', 35)
                """)
                
                cursor.execute("SELECT * FROM users")
                users = cursor.fetchall()
                logger.info(users)
                return users
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
        finally:
            connection.close()
    return ["hamid"]
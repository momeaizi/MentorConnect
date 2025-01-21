import os
import psycopg2
import sys
from loguru import logger

def apply_migration(file_path):
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )
    try:
        with conn:
            with conn.cursor() as cursor:
                with open(file_path, 'r') as file:
                    cursor.execute(file.read())
                logger.success(f"Applied migration: {file_path}")
    except Exception as e:
        logger.error(f"Error applying migration {file_path}: {e}")
    finally:
        conn.close()


apply_migration(sys.argv[1])

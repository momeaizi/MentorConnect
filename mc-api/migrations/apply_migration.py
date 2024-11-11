import os
import psycopg2
import sys

def apply_migration(file_path):
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'mc_db'),
        user=os.getenv('DB_USER', 'myuser'),
        password=os.getenv('DB_PASSWORD', 'mypassword')
    )
    try:
        with conn:
            with conn.cursor() as cursor:
                with open(file_path, 'r') as file:
                    cursor.execute(file.read())
                print(f"Applied migration: {file_path}")
    except Exception as e:
        print(f"Error applying migration {file_path}: {e}")
    finally:
        conn.close()


apply_migration(sys.argv[1])

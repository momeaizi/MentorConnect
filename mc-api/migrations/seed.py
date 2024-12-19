import psycopg2
from datetime import datetime
from flask_bcrypt import Bcrypt
import os
from loguru import logger

# Database connection parameters
DB_PARAMS = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': 5432
}

bcrypt = Bcrypt() 
hashed_password = bcrypt.generate_password_hash("taha").decode('utf-8')

# Sample data for the tables
users_data = [
    ('alice', 'alice@example.com', hashed_password, True),
    ('bob', 'bob@example.com', hashed_password, True),
    ('charlie', 'charlie@example.com', hashed_password, True),
    ('dave', 'dave@example.com', hashed_password, True),
    ('eve', 'eve@example.com', hashed_password, True)
]

# Sample notifications data
notifications_data = [
    (1, 2, datetime(2024, 11, 28, 9, 0, 0), False, 'like'),
    (2, 3, datetime(2024, 11, 28, 10, 15, 0), False, 'comment'),
    (3, 4, datetime(2024, 11, 29, 11, 30, 0), True, 'follow'),
    (4, 1, datetime(2024, 11, 29, 13, 45, 0), False, 'mention'),
    (5, 2, datetime(2024, 11, 30, 15, 0, 0), True, 'message')
]

def seed_data():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Insert data into users table
        cur.executemany("""
            INSERT INTO users (username, email, password_hash, is_verified)
            VALUES (%s, %s, %s, %s)
        """, users_data)

        # Insert data into notifications table
        cur.executemany("""
            INSERT INTO notifications (notified_user_id, actor_id, notification_time, is_seen, type)
            VALUES (%s, %s, %s, %s, %s)
        """, notifications_data)

        # Commit the transaction
        conn.commit()
        logger.success("Data seeded successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        logger.error(f"Error while seeding data: {error}")
        conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

# Run the seed function
if __name__ == "__main__":
    seed_data()

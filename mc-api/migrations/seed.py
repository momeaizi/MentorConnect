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

# profile_views_data = [
#     (1, 2, datetime(2024, 11, 1, 10, 0, 0)),
#     (2, 1, datetime(2024, 11, 2, 11, 0, 0)),
#     (3, 1, datetime(2024, 11, 3, 14, 30, 0)),
#     (4, 2, datetime(2024, 11, 4, 9, 15, 0)),
#     (1, 3, datetime(2024, 11, 5, 12, 45, 0))
# ]

# profile_likes_data = [
#     (1, 2, datetime(2024, 11, 1, 11, 30, 0)),
#     (2, 3, datetime(2024, 11, 2, 16, 0, 0)),
#     (3, 4, datetime(2024, 11, 3, 17, 45, 0)),
#     (4, 1, datetime(2024, 11, 4, 19, 20, 0)),
#     (5, 1, datetime(2024, 11, 5, 13, 10, 0))
# ]

# Function to insert data into the database
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

        # Insert data into profile_views table
        # cur.executemany("""
        #     INSERT INTO profile_views (viewer_id, profile_owner_id, viewed_at)
        #     VALUES (%s, %s, %s)
        # """, profile_views_data)

        # # Insert data into profile_likes table
        # cur.executemany("""
        #     INSERT INTO profile_likes (liker_id, liked_profile_id, liked_at)
        #     VALUES (%s, %s, %s)
        # """, profile_likes_data)

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
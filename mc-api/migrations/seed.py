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

notifications_data = [
    (1, 2, datetime(2024, 11, 28, 9, 0, 0), False, 'like'),
    (2, 3, datetime(2024, 11, 28, 10, 15, 0), False, 'comment'),
    (3, 4, datetime(2024, 11, 29, 11, 30, 0), True, 'follow'),
    (4, 1, datetime(2024, 11, 29, 13, 45, 0), False, 'mention'),
    (5, 2, datetime(2024, 11, 30, 15, 0, 0), True, 'message')
]

profile_likes_data = [
    (1, 2, datetime(2024, 12, 1, 12, 0, 0)),
    (1, 3, datetime(2024, 12, 1, 12, 0, 0)),
    (1, 4, datetime(2024, 12, 1, 12, 0, 0)),
    (1, 5, datetime(2024, 12, 1, 12, 0, 0)),
    (2, 3, datetime(2024, 12, 1, 13, 30, 0)),
    (3, 4, datetime(2024, 12, 2, 14, 45, 0)),
    (4, 5, datetime(2024, 12, 3, 15, 15, 0)),
    (5, 1, datetime(2024, 12, 3, 16, 30, 0))
]
profile_views_data = [
    (1, 2, datetime(2024, 12, 1, 14, 0, 0)),
    (1, 3, datetime(2024, 12, 1, 14, 0, 0)),
    (1, 4, datetime(2024, 12, 1, 14, 0, 0)),
    (1, 5, datetime(2024, 12, 1, 14, 0, 0)),
    (2, 3, datetime(2024, 12, 1, 15, 0, 0)),
    (3, 4, datetime(2024, 12, 2, 10, 0, 0)),
    (4, 5, datetime(2024, 12, 2, 11, 0, 0)),
    (5, 1, datetime(2024, 12, 3, 9, 0, 0))
]

def seed_data():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Create tables if not exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS profile_likes (
                id SERIAL PRIMARY KEY,
                liker_id INT NOT NULL,
                liked_profile_id INT NOT NULL,
                liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(liker_id, liked_profile_id),
                CONSTRAINT fk_liker
                    FOREIGN KEY(liker_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_liked_profile
                    FOREIGN KEY(liked_profile_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS profile_views (
                id SERIAL PRIMARY KEY,
                viewer_id INTEGER NOT NULL,
                profile_owner_id INTEGER NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_viewer
                    FOREIGN KEY(viewer_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_profile_owner
                    FOREIGN KEY(profile_owner_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        """)

        # Insert data into users table
        cur.executemany("""
            INSERT INTO users (username, email, password_hash, is_verified)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, users_data)

        # Insert data into notifications table
        cur.executemany("""
            INSERT INTO notifications (notified_user_id, actor_id, notification_time, is_seen, type)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, notifications_data)

        # Insert data into profile_likes table
        cur.executemany("""
            INSERT INTO profile_likes (liker_id, liked_profile_id, liked_at)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, profile_likes_data)

        # Insert data into profile_views table
        cur.executemany("""
            INSERT INTO profile_views (viewer_id, profile_owner_id, viewed_at)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, profile_views_data)

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

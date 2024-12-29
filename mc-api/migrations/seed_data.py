import psycopg2
from datetime import datetime, timedelta
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

# Function to hash passwords
def generate_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

# Sample data
hashed_password = generate_password("password123")

users_data = [
    ('alice', 'alice@example.com', hashed_password, True, 'Alice', 'Smith', 'female', 'Loves hiking', '1990-01-01', 100, True, datetime.now(), 'POINT(-122.33 47.60)'),
    ('bob', 'bob@example.com', hashed_password, True, 'Bob', 'Brown', 'male', 'Avid reader', '1985-03-15', 200, False, datetime.now(), 'POINT(-0.13 51.51)'),
    ('charlie', 'charlie@example.com', hashed_password, True, 'Charlie', 'Davis', 'female', 'Dog lover', '1992-07-20', 150, True, datetime.now(), 'POINT(2.35 48.85)'),
    ('diana', 'diana@example.com', hashed_password, True, 'Diana', 'White', 'female', 'Chef and traveler', '1995-05-10', 250, True, datetime.now(), 'POINT(12.49 41.89)'),
    ('eric', 'eric@example.com', hashed_password, True, 'Eric', 'Green', 'male', 'Tech enthusiast', '1990-11-22', 300, False, datetime.now(), 'POINT(-74.00 40.71)'),
]

interests_data = [
    ('Hiking',),
    ('Reading',),
    ('Gaming',),
    ('Cooking',),
    ('Traveling',),
    ('Photography',),
    ('Music',),
]

user_interests_data = [
    (1, 1), (1, 5),
    (2, 2), (2, 7),
    (3, 3),
    (4, 4), (4, 6),
    (5, 7),
]

pictures_data = [
    (1, 'alice_profile.jpg', True),
    (2, 'bob_profile.jpg', True),
    (3, 'charlie_profile.jpg', True),
    (4, 'diana_profile.jpg', True),
    (5, 'eric_profile.jpg', True),
]

notifications_data = [
    (1, 2, 'like'),
    (2, 1, 'view'),
    (3, 1, 'message'),
    (4, 5, 'friend_request'),
    (5, 4, 'comment'),
]

conversations_data = [
    (1, 2, False),
    (1, 3, True),
    (2, 4, True),
    (4, 5, False),
]

messages_data = [
    (1, 1, "Hey, how are you?"),
    (1, 2, "I'm good, thanks!"),
    (2, 3, "Hello!"),
    (3, 4, "Nice to meet you!"),
    (4, 5, "Where are you from?"),
]

profile_views_data = [
    (1, 2, datetime.now() - timedelta(days=5)),
    (2, 1, datetime.now() - timedelta(days=4)),
    (3, 4, datetime.now() - timedelta(days=3)),
    (4, 5, datetime.now() - timedelta(days=2)),
    (5, 1, datetime.now() - timedelta(days=1)),
]

profile_likes_data = [
    (1, 2, datetime.now() - timedelta(days=5)),
    (2, 3, datetime.now() - timedelta(days=4)),
    (3, 4, datetime.now() - timedelta(days=3)),
    (4, 5, datetime.now() - timedelta(days=2)),
    (5, 1, datetime.now() - timedelta(days=1)),
]

blocked_users_data = [
    (1, 3),
    (2, 1),
    (4, 5),
    (5, 4),
]

reported_users_data = [
    (3, 1),
    (2, 3),
    (4, 5),
    (5, 2),
]

# Seed function
def seed_data():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Insert data
        cur.executemany("""
            INSERT INTO users (username, email, password_hash, is_verified, first_name, last_name, gender, bio, birth_date, fame_rating, is_logged_in, last_logged_in, geolocation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, ST_GeomFromText(%s, 4326))
        """, users_data)

        cur.executemany("INSERT INTO interests (interest) VALUES (%s)", interests_data)

        cur.executemany("""
            INSERT INTO user_interests (user_id, interest_id)
            VALUES (%s, %s)
        """, user_interests_data)

        cur.executemany("""
            INSERT INTO pictures (user_id, file_name, is_profile)
            VALUES (%s, %s, %s)
        """, pictures_data)

        cur.executemany("""
            INSERT INTO notifications (notified_user_id, actor_id, type)
            VALUES (%s, %s, %s)
        """, notifications_data)

        cur.executemany("""
            INSERT INTO conversations (user_id_1, user_id_2, see)
            VALUES (%s, %s, %s)
        """, conversations_data)

        cur.executemany("""
            INSERT INTO messages (conversation_id, user_id, message)
            VALUES (%s, %s, %s)
        """, messages_data)

        cur.executemany("""
            INSERT INTO profile_views (viewer_id, profile_owner_id, viewed_at)
            VALUES (%s, %s, %s)
        """, profile_views_data)

        cur.executemany("""
            INSERT INTO profile_likes (liker_id, liked_profile_id, liked_at)
            VALUES (%s, %s, %s)
        """, profile_likes_data)

        cur.executemany("""
            INSERT INTO blocked_users (blocker_id, blocked_id)
            VALUES (%s, %s)
        """, blocked_users_data)

        cur.executemany("""
            INSERT INTO reported_users (reporter_id, reported_id)
            VALUES (%s, %s)
        """, reported_users_data)

        conn.commit()
        logger.success("Data seeded successfully!")

    except Exception as error:
        logger.error(f"Error while seeding data: {error}")
        conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

# Run the seed function
if __name__ == "__main__":
    seed_data()

import random
from faker import Faker
from flask_bcrypt import Bcrypt
import psycopg2
import os

# Initialize Faker
faker = Faker()
bcrypt = Bcrypt()

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port="5432"
)
cursor = conn.cursor()

plain_password = "taha"
hashed_password = bcrypt.generate_password_hash(plain_password).decode('utf-8')

# Helper function to seed data
def seed_users(n=100):
    print("Seeding users...")
    users = []
    for _ in range(n):
        users.append((
            faker.user_name(),
            faker.email(),
            hashed_password,
            faker.first_name(),
            faker.last_name(),
            random.choice(['Male', 'Female']),
            faker.text(max_nb_chars=200),
            faker.date_of_birth(minimum_age=18, maximum_age=80),
            random.randint(0, 100),
            faker.latitude(),
            faker.longitude()
        ))

    cursor.executemany("""
        INSERT INTO users (username, email, password_hash, first_name, last_name, gender, bio, birth_date, fame_rating, geolocation, is_verified)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, ST_Point(%s, %s), true)
    """, users)
    conn.commit()

def seed_interests(n=50):
    print("Seeding interests...")
    interests = [(faker.word(),) for _ in range(n)]

    # Use ON CONFLICT DO NOTHING to avoid duplicate errors
    cursor.executemany("""
        INSERT INTO interests (interest)
        VALUES (%s)
        ON CONFLICT (interest) DO NOTHING
    """, interests)
    conn.commit()

def seed_user_interests(n=200):
    print("Seeding user_interests...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT id FROM interests")
    interest_ids = [row[0] for row in cursor.fetchall()]

    user_interests = [
        (random.choice(user_ids), random.choice(interest_ids))
        for _ in range(n)
    ]

    cursor.executemany("""
        INSERT INTO user_interests (user_id, interest_id)
        VALUES (%s, %s)
    """, user_interests)
    conn.commit()

def seed_pictures(n=100):
    print("Seeding pictures...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    pictures = [
        (random.choice(user_ids), 'https://thispersondoesnotexist.com/')
        for _ in range(n)
    ]

    cursor.executemany("""
        INSERT INTO pictures (user_id, file_name)
        VALUES (%s, %s)
    """, pictures)
    conn.commit()

def seed_likes(n=200):
    print("Seeding profile likes...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    profile_likes = []
    for _ in range(n):
        liker_id = random.choice(user_ids)
        liked_profile_id = random.choice(user_ids)
        if liker_id != liked_profile_id:  # Prevent liking one's own profile
            profile_likes.append((liker_id, liked_profile_id))

    cursor.executemany("""
        INSERT INTO profile_likes (liker_id, liked_profile_id)
        VALUES (%s, %s)
        ON CONFLICT DO NOTHING
    """, profile_likes)
    conn.commit()

def seed_views(n=300):
    print("Seeding profile views...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    profile_views = []
    for _ in range(n):
        viewer_id = random.choice(user_ids)
        profile_owner_id = random.choice(user_ids)
        if viewer_id != profile_owner_id:  # Prevent viewing one's own profile
            profile_views.append((viewer_id, profile_owner_id, faker.date_time_this_year()))

    cursor.executemany("""
        INSERT INTO profile_views (viewer_id, profile_owner_id, viewed_at)
        VALUES (%s, %s, %s)
    """, profile_views)
    conn.commit()

# Call the seed functions
try:
    seed_users(100)
    seed_interests(50)
    seed_user_interests(200)
    seed_pictures(100)
    seed_likes(200)
    seed_views(300)
    print("Data seeding completed successfully!")
except Exception as e:
    print(f"Error while seeding data: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()

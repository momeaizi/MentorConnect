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
        (random.choice(user_ids), faker.file_name(extension="jpg"), random.choice([True, False]))
        for _ in range(n)
    ]

    cursor.executemany("""
        INSERT INTO pictures (user_id, file_name, is_profile)
        VALUES (%s, %s, %s)
    """, pictures)
    conn.commit()

# Call the seed functions
try:
    seed_users(100)
    seed_interests(50)
    seed_user_interests(200)
    seed_pictures(100)
    print("Data seeding completed successfully!")
except Exception as e:
    print(f"Error while seeding data: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()

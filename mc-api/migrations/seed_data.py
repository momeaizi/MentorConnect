import random
from faker import Faker
from flask_bcrypt import Bcrypt
import psycopg2
import os
from loguru import logger
import requests


# Initialize Faker and Bcrypt
faker = Faker()
bcrypt = Bcrypt()

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port="5432"
)
cursor = conn.cursor()

# Generate a hashed password
plain_password = "password123"
hashed_password = bcrypt.generate_password_hash(plain_password).decode('utf-8')

# Seed users
def seed_users(n=500):
    logger.info(f"Seeding {n} users...")
    users = set()
    for i in range(n):
        username = faker.unique.user_name()[:12] + (i + 1)
        email = username +'@gmail.com'
        first_name = faker.first_name()
        last_name = faker.last_name()
        gender = random.choice(['male', 'female'])
        bio = faker.text(max_nb_chars=250)
        birth_date = faker.date_of_birth(minimum_age=18, maximum_age=80)
        latitude = faker.latitude()
        longitude = faker.longitude()
        is_verified = True
        is_complete = True
        users.add((
            username, email, hashed_password, is_verified, is_complete,
            first_name, last_name, gender, bio, birth_date, latitude, longitude
        ))

    cursor.executemany("""
        INSERT INTO users (
            username, email, password_hash, is_verified, is_complete, 
            first_name, last_name, gender, bio, birth_date, geolocation
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, ST_Point(%s, %s))
        ON CONFLICT (username) DO NOTHING;
    """, list(users))
    conn.commit()
    logger.success(f"Successfully seeded {n} unique users!")

# Seed user_interests
def seed_user_interests(n=1000):
    logger.info("Seeding user_interests...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT id FROM interests")
    interest_ids = [row[0] for row in cursor.fetchall()]

    user_interests = set()
    for _ in range(n):
        user_id = random.choice(user_ids)
        interest_id = random.choice(interest_ids)
        user_interests.add((user_id, interest_id))

    cursor.executemany("""
        INSERT INTO user_interests (user_id, interest_id)
        VALUES (%s, %s)
        ON CONFLICT (user_id, interest_id) DO NOTHING;
    """, list(user_interests))
    conn.commit()
    logger.success(f"Successfully seeded {n} user_interests!")

# Seed profile_likes
def seed_profile_likes(n=300):
    logger.info("Seeding profile_likes...")
    cursor.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cursor.fetchall()]

    profile_likes = set()
    for _ in range(n):
        liker_id = random.choice(user_ids)
        liked_profile_id = random.choice(user_ids)
        if liker_id != liked_profile_id:
            profile_likes.add((liker_id, liked_profile_id))

    cursor.executemany("""
        INSERT INTO profile_likes (liker_id, liked_profile_id)
        VALUES (%s, %s)
        ON CONFLICT DO NOTHING;
    """, list(profile_likes))
    conn.commit()
    logger.success(f"Successfully seeded {n} profile_likes!")

# Seed other tables (views, removed_likes, etc.)
def seed_other_tables():
    # Implement similar logic for profile_views, profile_removed_likes, etc.
    logger.info("Seeding other tables... (to be implemented)")
    pass

def seed_pictures():
    logger.info("Seeding pictures...")
    cursor.execute("SELECT id, username FROM users")
    users = [(row[0], row[1]) for row in cursor.fetchall()]

    # Ensure the upload directory exists
    upload_dir = "./uploads"
    os.makedirs(upload_dir, exist_ok=True)

    pictures = []
    for user in users:
        user_id = user[0]
        username = user[1]
        # Add 1-5 pictures per user
        for file_key in range(random.randint(1, 5)):
            file_name = download_random_image(upload_dir, user_id, username, file_key=file_key + 1)
            pictures.append((user_id, file_name, False))
        
        # Ensure at least one profile picture
        profile_picture = download_random_image(upload_dir, user_id, username, True)
        pictures.append((user_id, profile_picture, True))

        cursor.execute("""
            UPDATE users 
            SET picture_name = %s 
            WHERE id = %s
        """, (profile_picture, user_id))

    cursor.executemany("""
        INSERT INTO pictures (user_id, file_name, is_profile)
        VALUES (%s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, pictures)
    conn.commit()
    logger.success(f"Successfully seeded pictures!")

def download_random_image(upload_dir, user_id, username, is_profile=False, file_key=None):
    """
    Downloads a random image and saves it to the specified directory.
    Determines the file extension based on the Content-Type header.

    Args:
        upload_dir (str): Path to the directory where the image will be saved.

    Returns:
        str: The file name of the downloaded image.
    """
    # Random image source (e.g., thispersondoesnotexist.com)
    image_url = "https://thispersondoesnotexist.com/"

    try:
        # Send the request to download the image
        response = requests.get(image_url, stream=True)
        response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)

        # Get the content type (e.g., image/jpeg, image/png)
        content_type = response.headers.get("Content-Type", "")
        if not content_type.startswith("image/"):
            raise ValueError(f"Unexpected Content-Type: {content_type}")

        # Map the content type to a file extension
        extension = content_type.split("/")[-1]  # Extract the type (e.g., jpeg, png)
        if extension == "jpeg":  # Normalize jpeg to jpg
            extension = "jpg"

        # Generate a unique file name
        if is_profile:
            file_name = f"{username}_{user_id}_profile.{extension}"
        else:
            file_name = f"{username}_{user_id}{file_key}.{extension}"

        file_path = os.path.join(upload_dir, file_name)

        # Save the image to the upload directory
        with open(file_path, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        logger.info(f"Image downloaded and saved as: {file_path}")
        return file_name
    except Exception as e:
        logger.error(f"Failed to download image: {e}")
        return None


# Run the seeding process
n = 515
try:
    seed_users(n)
    seed_user_interests(n * 5)
    seed_pictures()
    seed_profile_likes(n // 2)
    logger.success("Data seeding completed successfully!")
except Exception as e:
    logger.error(f"Error while seeding data: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()

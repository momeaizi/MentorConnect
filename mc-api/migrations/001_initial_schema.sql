CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_complete BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    gender VARCHAR(50),
    bio TEXT,
    birth_date DATE,
    picture_name VARCHAR(100),
    is_logged_in BOOLEAN DEFAULT FALSE,
    last_logged_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geolocation geography(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  interests(
    id SERIAL PRIMARY KEY,
    interest VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE  user_interests(
    id SERIAL PRIMARY KEY,
    interest_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, interest_id)
);

CREATE TABLE pictures (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(100) UNIQUE NOT NULL,
    is_profile BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE UNIQUE INDEX unique_profile_per_user
ON pictures (user_id)
WHERE is_profile = TRUE;


CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    notified_user_id INT NOT NULL,
    actor_id INT NOT NULL,
    notification_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_seen BOOLEAN DEFAULT FALSE,
    type VARCHAR(100) NOT NULL,
    FOREIGN KEY (notified_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    see BOOLEAN DEFAULT TRUE,
    last_message_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id_1, user_id_2)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL, 
    user_id INT NOT NULL,     
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE conversations ADD CONSTRAINT fk_last_message FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE CASCADE;

CREATE TABLE profile_views (
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

CREATE TABLE profile_likes (
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

CREATE TABLE profile_removed_likes (
    id SERIAL PRIMARY KEY,
    liker_id INT NOT NULL,
    liked_profile_id INT NOT NULL,
    removed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

CREATE INDEX idx_removed_likes_liker_liked ON profile_removed_likes (liker_id, liked_profile_id);

CREATE TABLE blocked_users (
    id SERIAL PRIMARY KEY,
    blocker_id INT NOT NULL,
    blocked_id INT NOT NULL,
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id),
    CONSTRAINT fk_blocker
        FOREIGN KEY(blocker_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_blocked
        FOREIGN KEY(blocked_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE reported_users (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_id INT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reporter_id, reported_id),
    CONSTRAINT fk_reporter
        FOREIGN KEY(reporter_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reported
        FOREIGN KEY(reported_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);



-- seed interests

INSERT INTO interests (interest)
VALUES
    ('Photography'),
    ('Painting'),
    ('Gardening'),
    ('Cooking'),
    ('Baking'),
    ('Knitting'),
    ('Woodworking'),
    ('DIY Projects'),
    ('Traveling'),
    ('Hiking'),
    ('Camping'),
    ('Fishing'),
    ('Cycling'),
    ('Running'),
    ('Fitness'),
    ('Swimming'),
    ('Yoga'),
    ('Dancing'),
    ('Martial Arts'),
    ('Chess'),
    ('Movies'),
    ('TV Shows'),
    ('Anime'),
    ('Reading'),
    ('Writing'),
    ('Poetry'),
    ('Comic Books'),
    ('Video Games'),
    ('Board Games'),
    ('Puzzles'),
    ('Magic Tricks'),
    ('Stand-Up Comedy'),
    ('Music Composition'),
    ('Singing'),
    ('Playing Instruments'),
    ('Collecting'),
    ('Podcast Listening'),
    ('Live Theater'),
    ('Concerts'),
    ('Karaoke'),
    ('Soccer'),
    ('Basketball'),
    ('Tennis'),
    ('Golf'),
    ('Baseball'),
    ('Cricket'),
    ('Rugby'),
    ('Boxing'),
    ('Skiing'),
    ('Snowboarding'),
    ('Surfing'),
    ('E-Sports'),
    ('Skateboarding'),
    ('Rock Climbing'),
    ('Horse Riding'),
    ('Scuba Diving'),
    ('Archery'),
    ('Badminton'),
    ('Table Tennis'),
    ('Volleyball'),
    ('Learning New Languages'),
    ('Public Speaking'),
    ('Coding'),
    ('Meditation'),
    ('Writing Journals'),
    ('Mindfulness'),
    ('Leadership Skills'),
    ('Networking'),
    ('Productivity Hacks'),
    ('Personal Finance'),
    ('Goal Setting'),
    ('Entrepreneurship'),
    ('Investing'),
    ('Volunteering'),
    ('Environmental Activism'),
    ('Fashion'),
    ('Makeup & Beauty'),
    ('Skincare'),
    ('Hair Styling'),
    ('Luxury Cars'),
    ('Interior Design'),
    ('Home Organization'),
    ('Minimalism'),
    ('Pet Care'),
    ('Parenting'),
    ('Social Media Trends'),
    ('Astrology'),
    ('Eco-Friendly Living'),
    ('Veganism'),
    ('Coffee Culture'),
    ('Astronomy'),
    ('Space Exploration'),
    ('Artificial Intelligence'),
    ('Robotics'),
    ('Quantum Computing'),
    ('Blockchain'),
    ('Crypto Trading'),
    ('Science Experiments'),
    ('Physics'),
    ('Chemistry'),
    ('Biology'),
    ('Psychology')
ON CONFLICT (interest) DO NOTHING;
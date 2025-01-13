CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_complete BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(50),
    bio TEXT,
    birth_date DATE,
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

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    validate BOOLEAN DEFAULT FALSE,
    is_logged_in BOOLEAN DEFAULT FALSE,
    last_logged_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
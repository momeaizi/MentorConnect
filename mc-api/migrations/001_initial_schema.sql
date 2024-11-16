CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

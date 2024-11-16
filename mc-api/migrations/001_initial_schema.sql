CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
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


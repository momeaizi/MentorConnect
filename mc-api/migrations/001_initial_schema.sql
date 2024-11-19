CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    validate BOOLEAN DEFAULT FALSE,
    --for update
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(50),
    bio TEXT,
    birth_date DATE,
    fame_rate INT DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    last_connection TIMESTAMP,
    profile_pic BYTEA,
    pictures BYTEA[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE  user_tags(
--     id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(id) ON DELETE CASCADE,
--     tag VARCHAR(100) NOT NULL
-- );


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
    see BOOLEAN DEFAULT FALSE,
    last_message_id INT,
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
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

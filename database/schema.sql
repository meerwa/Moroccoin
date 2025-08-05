CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount NUMERIC,
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Données de test
INSERT INTO users (name, email, phone) VALUES
('Omar', 'omar@email.com', '0612345678'),
('Sara', 'sara@email.com', '0623456789');

INSERT INTO transactions (user_id, amount, status) VALUES
(1, 200, 'completed'),
(2, 500, 'pending');


CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insérer un utilisateur admin (mot de passe: admin123)
INSERT INTO admin_users (username, password) VALUES 
('admin', 'admin123');
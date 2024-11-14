-- Erasmo Cardoso MYSQL Init Script


-- Criação do banco de dados "chat", se não existir
CREATE DATABASE IF NOT EXISTS chat;

-- Seleção do banco de dados "chat"
USE chat;

-- Criação de tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- ID único do usuário
    username VARCHAR(50) NOT NULL,                     -- Nome de usuário (pode repetir)
    email VARCHAR(100)  NOT NULL,                -- E-mail único
    password_hash VARCHAR(255) NOT NULL,               -- Senha criptografada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Data de criação
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Data de última atualização
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criação de tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- ID único da mensagem
    sender_id INT NOT NULL,                            -- ID do usuário remetente (FK)
    receiver_id INT NOT NULL,                          -- ID do usuário receptor (FK)
    message TEXT NOT NULL,                             -- Texto da mensagem
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Data e hora do envio
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criação de índice para mensagens por data (para otimizar buscas de chats recentes)
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Exemplo de inserção de usuários (apenas para demonstração)
INSERT INTO users (username, email, password_hash)
VALUES 
  ('user1', 'user1@example.com', 'hashed_password1'),
  ('user2', 'user2@example.com', 'hashed_password2'),
  ('erasmo', 'erascardsilva@gmail.com', '3727'),  -- Inserção do usuário Erasmo com senha '3727'
  ('erasmo', 'erasmo.duplicado@gmail.com', 'hashed_password_duplicado'); -- Exemplo de repetição de username

-- Exemplo de inserção de mensagens (apenas para demonstração)
INSERT INTO messages (sender_id, receiver_id, message)
VALUES 
  (1, 2, 'Hello, user2! How are you?'),
  (2, 1, 'Hi, user1! I am doing great, thanks!');

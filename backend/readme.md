CREATE DATABASE chat_app;

-- Select the database
USE chat_app;

-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,  -- Added fullName field
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Messages table
CREATE TABLE Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(20) to VARCHAR(255) to match email length
    receiver_id VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(20) to VARCHAR(255) to match email length
    message TEXT NOT NULL,
    iv VARCHAR(255) NOT NULL;
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(email),
    FOREIGN KEY (receiver_id) REFERENCES Users(email)
);

-- Create Groups table
CREATE TABLE Groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(20) to VARCHAR(255) to match email length
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(email)
);

-- Create GroupMembers table
CREATE TABLE GroupMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(20) to VARCHAR(255) to match email length
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (user_id) REFERENCES Users(email)
);

-- Create GroupMessages table
CREATE TABLE GroupMessages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    sender_id VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(20) to VARCHAR(255) to match email length
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (sender_id) REFERENCES Users(email)
);

-- Create GroupAdmins table with ON DELETE CASCADE for group_id
CREATE TABLE GroupAdmins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Users(email)
);
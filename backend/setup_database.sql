-- Database setup for Intelligent Internship Navigator
CREATE DATABASE IF NOT EXISTS internship_navigator_db;
USE internship_navigator_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_complete BOOLEAN DEFAULT FALSE,
    skills TEXT,
    highest_qualification VARCHAR(255),
    field_of_study VARCHAR(255),
    work_experience VARCHAR(255),
    work_experience_details TEXT,
    internet_access VARCHAR(255),
    languages TEXT,
    internship_mode VARCHAR(255),
    commitment VARCHAR(255),
    preferred_industries TEXT,
    preferred_tasks TEXT,
    stipend_requirement VARCHAR(255),
    stay_away VARCHAR(255),
    relocation VARCHAR(255),
    special_support TEXT,
    document_readiness VARCHAR(255),
    contact_consent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_profile_complete ON users(profile_complete);

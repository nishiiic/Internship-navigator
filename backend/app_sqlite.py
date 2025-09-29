# backend/app_sqlite.py - Alternative version using SQLite for easier setup

from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import uuid
import hashlib
import json
import time
import os
from main import analyze_resume

app = Flask(__name__)
CORS(app)

# --- Configuration for file uploads ---
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- SQLite DATABASE CONFIGURATION ---
DATABASE = 'internship_navigator.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            profile_complete BOOLEAN DEFAULT FALSE,
            skills TEXT,
            highest_qualification TEXT,
            field_of_study TEXT,
            work_experience TEXT,
            work_experience_details TEXT,
            internet_access TEXT,
            languages TEXT,
            internship_mode TEXT,
            commitment TEXT,
            preferred_industries TEXT,
            preferred_tasks TEXT,
            stipend_requirement TEXT,
            stay_away TEXT,
            relocation TEXT,
            special_support TEXT,
            document_readiness TEXT,
            contact_consent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def generate_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_password_hash(password_hash, password):
    return password_hash == hashlib.sha256(password.encode()).hexdigest()

# Initialize database on startup
init_db()

# --- AUTHENTICATION ENDPOINTS ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    
    password_hash = generate_password_hash(data['password'])
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            (data['name'], data['email'], password_hash)
        )
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User with this email already exists"}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({"error": "Missing email or password"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
    user = cursor.fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], data['password']):
        token = str(uuid.uuid4())
        return jsonify({
            "message": "Login successful",
            "token": token,
            "name": user['name'],
            "profile_complete": bool(user['profile_complete']),
            "quiz_taken": bool(user['internship_mode'])
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

# --- ONBOARDING & QUIZ SUBMISSION ---
@app.route('/api/onboarding', methods=['POST'])
def complete_onboarding():
    return submit_quiz()

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Authorization token is missing"}), 401
    
    data = request.get_json()
    user_email = data.pop('email', None)
    if not user_email: 
        return jsonify({"error": "User email is missing"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build update query dynamically
    update_fields = []
    values = []
    
    for key, value in data.items():
        if key != 'email':
            update_fields.append(f"{key} = ?")
            values.append(", ".join(value) if isinstance(value, list) else value)
    
    update_fields.append("profile_complete = TRUE")
    values.append(user_email)
    
    sql_query = f"UPDATE users SET {', '.join(update_fields)} WHERE email = ?"
    
    try:
        cursor.execute(sql_query, tuple(values))
        conn.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- PROFILE ENDPOINTS ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Authorization token missing"}), 401
    
    user_email = request.args.get('email')
    if not user_email: 
        return jsonify({"error": "User email is required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''SELECT name, email, skills, highest_qualification, field_of_study, 
                     work_experience, work_experience_details, internet_access, languages, 
                     internship_mode, commitment, preferred_industries, preferred_tasks, 
                     stipend_requirement, stay_away, relocation, special_support, 
                     document_readiness, contact_consent FROM users WHERE email = ?''', (user_email,))
    
    profile = cursor.fetchone()
    conn.close()
    
    if profile:
        preference_tags = []
        profile_dict = dict(profile)
        
        if profile_dict.get('internship_mode'): 
            preference_tags.append(profile_dict['internship_mode'].replace('_', '-'))
        if profile_dict.get('commitment'): 
            preference_tags.append(profile_dict['commitment'].replace('_', '-'))
        if profile_dict.get('preferred_industries'): 
            preference_tags.extend([tag.strip().replace('_', '-') for tag in profile_dict['preferred_industries'].split(',')])
        if profile_dict.get('preferred_tasks'): 
            preference_tags.extend([tag.strip().replace('_', '-') for tag in profile_dict['preferred_tasks'].split(',')])
        if profile_dict.get('stipend_requirement'): 
            preference_tags.append(profile_dict['stipend_requirement'].replace('_', '-'))
        if profile_dict.get('relocation'): 
            preference_tags.append(profile_dict['relocation'].replace('_', '-'))
        
        profile_dict['preference_tags'] = ", ".join(filter(None, preference_tags))
        return jsonify(profile_dict), 200
    
    return jsonify({"error": "User not found"}), 404

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Authorization token missing"}), 401
    
    data = request.get_json()
    user_email = data.get('email')
    
    update_fields = []
    values = []
    
    for key, value in data.items():
        if key not in ['email', 'preference_tags']:
            update_fields.append(f"{key} = ?")
            values.append(value)
    
    if not update_fields: 
        return jsonify({"message": "No fields to update"}), 200
    
    values.append(user_email)
    sql_query = f"UPDATE users SET {', '.join(update_fields)} WHERE email = ?"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(sql_query, tuple(values))
        conn.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- RESUME ANALYSIS ENDPOINT ---
@app.route('/api/resume/upload', methods=['POST'])
def upload_and_analyze_resume():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization token is missing"}), 401
        
    if 'resume' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        try:
            # Call your actual analysis function
            data = analyze_resume(filepath)
        except Exception as e:
            # Provide more specific error details if in debug mode
            return jsonify({"error": "An error occurred during analysis.", "details": str(e)}), 500
        finally:
            # Ensure the temporary file is always removed
            if os.path.exists(filepath):
                os.remove(filepath)
        
        return jsonify(data)

    return jsonify({"error": "An unexpected error occurred."}), 500

# --- INTERNSHIPS ENDPOINT ---
@app.route('/api/internships')
def get_internships():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Authorization token is missing"}), 401
    
    try:
        with open('internships.json', 'r', encoding='utf-8') as f:
            internships_data = json.load(f)
        return jsonify(internships_data)
    except FileNotFoundError:
        return jsonify({"error": "Internships data not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

# Intelligent Internship Navigator

A full-stack web application that helps students find and apply for internships based on their profile, skills, and preferences. The application includes resume analysis, personalized internship recommendations, and a comprehensive onboarding process.

## Features

- **User Authentication**: Sign up and login system with secure password hashing
- **Profile Management**: Comprehensive user profiles with skills, education, and preferences
- **Resume Analysis**: AI-powered resume parsing and analysis using spaCy
- **Onboarding Quiz**: Interactive quiz to understand user preferences and goals
- **Internship Matching**: Personalized internship recommendations based on user profile
- **Modern UI**: Built with React and Tailwind CSS for a responsive experience

## Tech Stack

### Backend
- **Python Flask**: Web framework
- **SQLite**: Database (easier setup than MySQL)
- **spaCy**: Natural language processing for resume analysis
- **pdfplumber**: PDF text extraction
- **python-docx**: Word document processing

### Frontend
- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **React Dropzone**: File upload component

## Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

## Quick Setup & Run

### 1. Clone the Repository
```bash
git clone <repository-url>
cd intelligent-internship-navigator-main
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app_sqlite.py
```
The backend will run on `http://localhost:5000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account
3. **Complete Onboarding**: Take the quiz to set your preferences
4. **Upload Resume**: Analyze your resume for skill extraction
5. **Browse Internships**: View personalized internship recommendations
6. **Manage Profile**: Update your information and preferences

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Profile Management
- `GET /api/profile?email=<email>` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/quiz/submit` - Submit onboarding quiz

### Resume Analysis
- `POST /api/resume/upload` - Upload and analyze resume

### Internships
- `GET /api/internships` - Get internship listings

## Database Schema

The application uses SQLite with the following main table:

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Hashed password
- `profile_complete`: Boolean flag
- `skills`: User's skills (JSON/text)
- `highest_qualification`: Education level
- `field_of_study`: Academic field
- `work_experience`: Work experience details
- `internship_mode`: Preferred internship type
- `commitment`: Time commitment
- `preferred_industries`: Industry preferences
- `preferred_tasks`: Task preferences
- `stipend_requirement`: Stipend needs
- `relocation`: Willingness to relocate

## File Structure

```
intelligent-internship-navigator-main/
├── backend/
│   ├── app.py              # Main Flask app (MySQL version)
│   ├── app_sqlite.py       # SQLite version (easier setup)
│   ├── main.py             # Resume analysis logic
│   ├── parser.py           # File parsing utilities
│   ├── extractor.py        # Text extraction functions
│   ├── requirements.txt    # Python dependencies
│   ├── internships.json    # Sample internship data
│   └── uploads/            # File upload directory
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── views/          # View components
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Node.js dependencies
│   └── public/             # Static files
└── README.md               # This file
```

## Development Notes

### Backend Configuration
- The app uses SQLite by default for easier setup
- For production, consider switching to PostgreSQL or MySQL
- File uploads are stored temporarily in the `uploads/` directory
- Resume analysis uses spaCy's English language model

### Frontend Configuration
- Uses React Router for navigation
- Tailwind CSS for styling
- Local storage for authentication tokens
- Responsive design for mobile and desktop

## Troubleshooting

### Common Issues

1. **spaCy Model Not Found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **Port Already in Use**
   - Backend: Change port in `app_sqlite.py` (line with `app.run()`)
   - Frontend: React will automatically suggest an alternative port

3. **Database Connection Issues**
   - The SQLite database is created automatically
   - Check file permissions in the backend directory

4. **File Upload Issues**
   - Ensure the `uploads/` directory exists and has write permissions
   - Check file size limits in Flask configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

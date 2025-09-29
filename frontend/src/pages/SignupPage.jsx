import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
const CheckIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>);
const CircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle></svg>);

const PasswordValidator = ({ password }) => {
    const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
    const ValidationItem = ({ isValid, text }) => (<div className={`flex items-center text-sm transition-colors ${isValid ? 'text-green-600' : 'text-gray-500'}`}>{isValid ? <CheckIcon className="w-4 h-4 mr-2" /> : <CircleIcon className="w-4 h-4 mr-2" />}{text}</div>);
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <ValidationItem isValid={validations.length} text="At least 8 characters" />
            <ValidationItem isValid={validations.uppercase} text="One uppercase letter" />
            <ValidationItem isValid={validations.lowercase} text="One lowercase letter" />
            <ValidationItem isValid={validations.number} text="One number" />
            <ValidationItem isValid={validations.special} text="One special character" />
        </div>
    );
};

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isFormValid = () => {
        const validations = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
        return Object.values(validations).every(Boolean) && name && email;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) { setError("Please fill all fields and meet password requirements."); return; }
        setError('');
        try {
            const response = await fetch('http://127.0.0.1:5001/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create account.');
            navigate('/login');
        } catch (err) { setError(err.message); }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-green-500 flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="flex-grow flex relative z-10">
            <div className="hidden lg:block relative w-0 flex-1 bg-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center">
                    <div className="text-center px-12">
                        <div className="relative mb-8">
                            <div className="bg-white text-orange-600 text-5xl font-bold w-24 h-24 flex items-center justify-center rounded-2xl mx-auto shadow-2xl transform -rotate-3">
                                IN
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <h2 className="mt-6 text-5xl font-bold text-white mb-4">Join Internship Navigator</h2>
                        <p className="mt-4 text-white/90 text-xl mb-8">
                            Start your career journey with smart matching
                        </p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
                                <div className="flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium">Resume Analysis</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
                                <div className="flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium">Smart Matching</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-xl mx-auto mb-4">
                            IN
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                        <p className="text-sm text-gray-600">
                            Join thousands of students finding their dream internships
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input 
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    required 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50" 
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    autoComplete="email" 
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50" 
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50" 
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>
                        
                        <PasswordValidator password={password} />
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={!isFormValid()} 
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            Create Account
                        </button>
                        
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}
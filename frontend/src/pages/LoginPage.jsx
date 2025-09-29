import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to login.');
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('profileComplete', data.profile_complete ? 'true' : 'false');
            localStorage.setItem('quizTaken', data.quiz_taken ? 'true' : 'false');

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
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
                                <div className="bg-white text-orange-600 text-5xl font-bold w-24 h-24 flex items-center justify-center rounded-2xl mx-auto shadow-2xl transform rotate-3">
                                    IN
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <h2 className="mt-6 text-5xl font-bold text-white mb-4">Internship Navigator</h2>
                            <p className="mt-4 text-white/90 text-xl mb-8">
                                Smart matching for your career journey
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
                                    <div className="flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-sm font-medium">AI-Powered</span>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                            <p className="text-sm text-gray-600">
                                Sign in to continue your journey
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
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
                                        autoComplete="current-password" 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50" 
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Sign in
                            </button>
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                        Create one here
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
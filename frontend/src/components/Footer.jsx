import React from 'react';


export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white text-lg font-bold w-10 h-10 flex items-center justify-center rounded-lg mr-3">
                            IN
                        </div>
                        <span className="text-lg font-bold text-gray-800">Internship Navigator</span>
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dashboard</button>
                        <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Profile</button>
                        <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</button>
                    </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Internship Navigator. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
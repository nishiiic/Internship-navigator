import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// --- Icons ---
const UploadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>);
const LoaderIcon = (props) => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const TargetIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> );

export default function OnboardingModal({ show, onComplete, onSkip }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ education: '', field_of_study: '', skills: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(acceptedFiles => { setResumeFile(acceptedFiles[0]); }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeScan = async () => {
        if (!resumeFile) return;
        setIsUploading(true);
        setError('');
        const uploadData = new FormData();
        uploadData.append('resume', resumeFile);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:5001/api/resume/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to scan resume.");
            setFormData(prev => ({ ...prev, skills: data.extracted_skills.join(', ') }));
        } catch (err) { setError(err.message); } finally { setIsUploading(false); }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch('http://127.0.0.1:5001/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...formData, email: userEmail }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save profile.");
            onComplete();
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); // This ensures the loading state is always reset
        }
    };

    const steps = ["Education", "Resume", "Skills"];
    
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex overflow-hidden transform transition-all">
                {/* Left Decorative Panel */}
                <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-gradient-to-br from-orange-500 to-green-500 p-8 text-white relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative z-10 text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                            <div className="bg-white text-orange-600 text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-xl mx-auto mb-4">
                                IN
                            </div>
                            <h2 className="text-2xl font-bold">PM Internship Profile</h2>
                            <p className="text-white/80 text-sm mt-2">पीएम इंटर्नशिप प्रोफाइल</p>
                        </div>
                        
                        <div className="space-y-4 w-full">
                            {steps.map((s, index) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${step > index ? 'bg-white text-orange-600' : step === index + 1 ? 'bg-white/30 text-white border-2 border-white/50' : 'bg-white/20 text-white/70'}`}>
                                        {step > index ? '✓' : index + 1}
                                    </div>
                                    <span className={`ml-4 text-lg transition-colors ${step >= index + 1 ? 'font-semibold text-white' : 'text-white/70'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full md:w-2/3 p-8 flex flex-col">
                    <form className="flex-grow flex flex-col" onSubmit={handleSubmit}>
                        <div className="flex-grow">
                            {step === 1 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Your Educational Background</h3>
                                    <p className="text-sm text-gray-500 mt-1">Tell us about your qualifications.</p>
                                    <div className="mt-6 space-y-4">
                                        <select name="education" required value={formData.education} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50">
                                            <option value="" disabled>Select Highest Education</option>
                                            <option value="High School Diploma">High School Diploma</option>
                                            <option value="Associate Degree">Associate Degree</option>
                                            <option value="Bachelor's Degree">Bachelor's Degree</option>
                                            <option value="Master's Degree">Master's Degree</option>
                                            <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                                        </select>
                                        <select name="field_of_study" required value={formData.field_of_study} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50">
                                            <option value="" disabled>Select Field of Study</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Data Science & Analytics">Data Science & Analytics</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Arts & Humanities">Arts & Humanities</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Upload Your Resume (Optional)</h3>
                                    <p className="text-sm text-gray-500 mt-1">Let our AI extract your skills to save you time.</p>
                                    <div className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-25'}`} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">Drag & drop, or click to select</p>
                                        <p className="text-xs text-gray-500 mt-1">PDF or DOCX files only</p>
                                    </div>
                                    {resumeFile && (
                                        <div className="mt-4 text-center">
                                            <p className="text-sm">Selected: <span className="font-medium">{resumeFile.name}</span></p>
                                            <button type="button" onClick={handleResumeScan} disabled={isUploading} className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 disabled:bg-gray-400 transition-all duration-200">
                                                {isUploading ? <LoaderIcon /> : "Scan for Skills"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {step === 3 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Confirm Your Skills</h3>
                                    <p className="text-sm text-gray-500 mt-1">Add or remove skills to accurately represent your abilities.</p>
                                    <textarea name="skills" rows="5" required value={formData.skills} onChange={handleInputChange} placeholder="e.g., Python, React, Data Analysis..." className="mt-6 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50"></textarea>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <button type="button" onClick={onSkip} className="text-sm font-medium text-gray-600 hover:text-gray-900">Skip for now</button>
                            <div className="flex items-center space-x-4">
                                <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50">Back</button>
                                {step < 3 ? (
                                    <button type="button" onClick={() => setStep(s => s + 1)} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 rounded-xl hover:from-orange-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105">Next</button>
                                ) : (
                                    <button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 rounded-xl hover:from-orange-600 hover:to-green-600 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105">
                                        {isLoading ? <LoaderIcon/> : 'Complete Profile'}
                                    </button>
                                )}
                            </div>
                        </div>
                         {error && <p className="text-xs text-red-600 text-right mt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
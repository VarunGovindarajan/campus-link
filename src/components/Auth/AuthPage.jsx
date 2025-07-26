import React, { useState } from 'react';
import api from '../../services/api';

const AuthPage = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false); // Controls the OTP step visibility

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- OTP Sending Logic ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic validation for college email format
        const collegeEmailRegex = /^[a-zA-Z0-9.]+@sece\.ac\.in$/;
        if (!collegeEmailRegex.test(formData.email)) {
            setError('Please use your official college email ID (e.g., your.name@sece.ac.in).');
            return;
        }

        try {
            const res = await api.post('/auth/send-otp', { email: formData.email });
            setSuccessMessage(res.data.msg); // Show success message from backend
            setShowOtpInput(true); // Proceed to OTP verification step
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send OTP. Please try again.');
        }
    };

    // --- OTP Verification & Registration Logic ---
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.post('/auth/verify-otp-and-register', {
                ...formData,
                otp,
                role: 'student' // Ensure role is always student for registration
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            // No need for alert, user is logged in and will be redirected
        } catch (err) {
            setError(err.response?.data?.msg || 'OTP verification failed. Please try again.');
        }
    };

    // --- Login Logic ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        }
    };
    
    // Determine which submit handler to use
    const handleSubmit = isLogin ? handleLogin : (showOtpInput ? handleVerifyAndRegister : handleSendOtp);

    // Function to reset all states when toggling form
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMessage('');
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setOtp('');
        setShowOtpInput(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-cyan-400">CampusLink</h1>
                    <p className="mt-2 text-gray-400">Your Centralized Student Hub</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    
                    {/* SIGN UP FORM FIELDS */}
                    {!isLogin && (
                        <>
                            <input name="name" onChange={handleChange} disabled={showOtpInput} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg disabled:opacity-50" type="text" placeholder="Full Name" required />
                            <input name="email" onChange={handleChange} disabled={showOtpInput} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg disabled:opacity-50" type="email" placeholder="Official College Email" required />
                            <input name="password" onChange={handleChange} disabled={showOtpInput} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg disabled:opacity-50" type="password" placeholder="Password" required />
                        </>
                    )}

                    {/* LOGIN FORM FIELDS */}
                    {isLogin && (
                        <>
                            <input name="email" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg" type="email" placeholder="Email Address" required />
                            <input name="password" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg" type="password" placeholder="Password" required />
                            <div>
                                <label htmlFor="role" className="text-sm text-gray-400">Login as</label>
                                <select id="role" name="role" onChange={handleChange} value={formData.role} className="w-full mt-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </>
                    )}
                    
                    {/* OTP INPUT FIELD (only for sign up step 2) */}
                    {!isLogin && showOtpInput && (
                        <input name="otp" onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg" type="text" placeholder="Enter OTP from your email" required />
                    )}

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {successMessage && <p className="text-green-400 text-sm text-center">{successMessage}</p>}

                    <button type="submit" className="w-full py-3 font-semibold text-gray-900 bg-cyan-400 rounded-lg hover:bg-cyan-500 transition-colors">
                        {isLogin ? 'Login' : (showOtpInput ? 'Verify & Register' : 'Send OTP')}
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={toggleForm} className="ml-2 font-semibold text-cyan-400 hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;

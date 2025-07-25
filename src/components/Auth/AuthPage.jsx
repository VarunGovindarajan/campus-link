import React, { useState } from 'react';
import api from '../../services/api';

const AuthPage = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        try {
            const res = await api.post(endpoint, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        }
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
                    {!isLogin && (
                        <input name="name" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" type="text" placeholder="Full Name" required />
                    )}
                    <input name="email" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" type="email" placeholder="Email Address" required />
                    <input name="password" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" type="password" placeholder="Password" required />
                    <select name="role" onChange={handleChange} value={formData.role} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full py-3 font-semibold text-gray-900 bg-cyan-400 rounded-lg hover:bg-cyan-500 transition-colors">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="ml-2 font-semibold text-cyan-400 hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;

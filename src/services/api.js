import axios from 'axios';

// This should match the port your backend is running on
const API_URL = 'https://campus-link-backend-0u9u.onrender.com/api';

// Create a centralized axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Use an interceptor to send the auth token with every protected request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;

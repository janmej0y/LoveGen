const API_URL = 'https://lovegen-1.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);

// User endpoints
export const getPotentialMatches = () => api.get('/users/potential-matches');

// Match endpoints
export const swipeRight = (userId) => api.post('/matches/like', { targetUserId: userId });
export const swipeLeft = (userId) => api.post('/matches/dislike', { targetUserId: userId });
// client/src/js/api.js (add these functions)

// Payments
export const createCheckout = (priceId) => api.post('/payments/create-checkout-session', { priceId });

// Photos
export const uploadProfilePhoto = (formData) => {
    return api.post('/users/me/photos', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
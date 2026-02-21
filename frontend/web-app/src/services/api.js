const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// We will store the token in memory. For a real app, you might use localStorage.
let token = null;

export const setToken = (newToken) => {
    token = newToken;
};

const api = async (url, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        // For DELETE requests, there might not be a body to parse
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`API call failed: ${method} ${url}`, error);
        throw error;
    }
};

// Auth functions
export const login = (credentials) => api('/auth/login', 'POST', credentials);
export const register = (userData) => api('/auth/register', 'POST', userData);

// User functions
export const getUsers = () => api('/users');
export const createUser = (userData) => api('/users', 'POST', userData);

// Order functions
export const getOrders = () => api('/orders');
export const createOrder = (orderData) => api('/orders', 'POST', orderData);
export const updateOrder = (orderId, status) => api(`/orders/${orderId}`, 'PUT', { status });


import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.access_token;
    Cookies.set('jwt', token, { expires: 1 });
    return token;
};
export const logout = async () => {
    Cookies.remove('jwt');
};

export const getUserProfile = async (token: string) => {
    const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const register = async (email: string, password: string, name: string) => {
    const response = await api.post('/users/register', { email, password, name });
    return response.data;
};
export default api;
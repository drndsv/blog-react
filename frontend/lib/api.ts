import axios from 'axios';
import Cookies from 'js-cookie';
import type { Article, Comment, PaginatedResponse } from './apiTypes';

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
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  const response = await api.post('/users/register', { email, password, name });
  return response.data;
};

export const getArticles = async (page = 1, limit = 20, query = '') => {
  const response = await api.get<PaginatedResponse<Article>>('/articles', {
    params: {
      page,
      limit,
      query,
    },
  });
  return response.data;
};

export const getComments = async (page = 1, limit = 50) => {
  const response = await api.get<PaginatedResponse<Comment>>('/comments', {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const createArticle = async (
  token: string,
  payload: { title: string; content: string; previewImage?: File | null },
) => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('content', payload.content);

  if (payload.previewImage) {
    formData.append('previewImage', payload.previewImage);
  }

  const response = await api.post<Article>('/articles', formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
export default api;

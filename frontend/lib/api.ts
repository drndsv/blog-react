import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export type User = {
  id: number;
  email: string;
  name: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  previewImage?: string | null;
  author?: User;
};

export type Comment = {
  id: number;
  content: string;
  user?: User;
  articleId?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageCount: number;
};

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

export const getArticles = async (page = 1, limit = 1, query = '') => {
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
export default api;

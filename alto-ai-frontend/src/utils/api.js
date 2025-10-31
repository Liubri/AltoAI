import axios from 'axios';
import store from '../redux/store';

const url = import.meta.env.VITE_BACKEND_BASE_URL
const api = axios.create({
  baseURL: url, 
});


api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  console.log("Adding token to request:", token);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  (error);
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
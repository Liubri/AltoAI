import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_BASE_URL
const api = axios.create({
  baseURL: url, 
});

api.interceptors.request.use((config) => {
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
import axios from 'axios';
import { getAccessToken } from './spotifyAuth.js';

const spotifyApi = axios.create({
  baseURL: `https://api.spotify.com`, 
});

spotifyApi.interceptors.request.use(async (config) => {
  if (config.user){
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${await getAccessToken(config.user)}`;
    delete config.user;
  }
  return config;
}, (error) => {
  (error);
  return Promise.reject(error);
});


spotifyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Spotify API error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data);
  }
);

export default spotifyApi;
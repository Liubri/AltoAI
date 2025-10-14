import axios from 'axios';

const spotifyApi = axios.create({
  baseURL: `https://api.spotify.com`, 
});

spotifyApi.interceptors.request.use((config) => {
  return config;
}, (error) => {
  (error);
  return Promise.reject(error);
});


spotifyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Spotify API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default spotifyApi;
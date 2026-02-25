import axios from 'axios'; // Load environment variables from .env file
const faceAPI = axios.create({
  // Point this to your Face Service port
  baseURL: import.meta.env.VITE_APP_FACE_URL
 // AI processing takes time, so 10s is safer than the default
});

// Add an interceptor to handle errors globally (optional but helpful)
faceAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Face Service Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default faceAPI;
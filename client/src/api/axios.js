
import axios from "axios";

const API = axios.create({
  // Added the required /api prefix to match your backend routes
  baseURL: "https://nexthire-ai-4.onrender.com"
});

// Automatically attaches the token to every request if the user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

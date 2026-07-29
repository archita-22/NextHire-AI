import axios from "axios";

const API = axios.create({
  baseURL: "https://nexthire-ai-4.onrender.com"
});

// Har request ke saath automatically token attach karega (agar login hai)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
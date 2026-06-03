import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const host = localStorage.getItem("api_url");
  if (host) config.baseURL = host.startsWith("http") ? host : `http://${host}`;
  return config;
});

export default api;
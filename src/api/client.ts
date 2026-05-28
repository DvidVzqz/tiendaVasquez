import axios from "axios";

const host = localStorage.getItem("api_url") || import.meta.env.VITE_API_URL;

const baseURL = host.startsWith("http") ? host : `http://${host}`;

const api = axios.create({
  baseURL: baseURL,
  // baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Interceptor para token (opcional)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
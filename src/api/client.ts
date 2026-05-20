import axios from "axios";

export const host='192.168.0.171:3000';
const baseURL=`http://${host}`;

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
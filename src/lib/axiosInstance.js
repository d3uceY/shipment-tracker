import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    timeout: 10000,
});

// Optional: Add interceptors for auth or headers
// axiosInstance.interceptors.request.use(config => {
//   const token = typeof window !== 'undefined' && localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => Promise.reject(error));

export default axiosInstance;

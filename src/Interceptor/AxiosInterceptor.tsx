import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
   baseURL: "http://localhost:9000",
   headers: {
      "Content-Type": "application/json",
   },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
   const token = localStorage.getItem("token");
   if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

export default axiosInstance;

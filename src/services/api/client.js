import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
let apiUnavailable = false;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 6000,
});

client.interceptors.request.use((config) => {
  if (apiUnavailable) {
    const error = new Error("API temporarily unavailable");
    error.code = "API_UNAVAILABLE";
    return Promise.reject(error);
  }
  const token = localStorage.getItem("velor_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.code === "ERR_NETWORK") {
      apiUnavailable = true;
    }
    return Promise.reject(error);
  }
);

export default client;

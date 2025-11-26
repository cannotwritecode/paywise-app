import axios from "axios";

// API Base URL - Backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (set after NextAuth sign-in)
    const token = typeof window !== "undefined" ? localStorage.getItem("api_token") : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("api_token");
        // Optionally redirect to sign-in
        // window.location.href = "/auth/signin";
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to set token (call after NextAuth sign-in)
export const setApiToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("api_token", token);
  }
};

// Helper function to clear token
export const clearApiToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("api_token");
  }
};

export default apiClient;

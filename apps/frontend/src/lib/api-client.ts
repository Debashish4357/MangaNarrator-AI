import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 60000, // 60 seconds (useful for long AI chapter-extraction queues)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API client error:", {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

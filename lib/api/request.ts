import axios from 'axios';

// Normalize error handling
function normaliseError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
  return error;
}

// Create axios instance with base configuration
const instance = axios.create({ 
  baseURL: '/api', 
  timeout: 10_000, 
});

// Add response interceptor for error handling
instance.interceptors.response.use(
  response => response, 
  error => Promise.reject(normaliseError(error)),
);

export default instance; 
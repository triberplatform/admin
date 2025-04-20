// /app/lib/api-client.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create a base axios instance for client-side API calls
const apiClient = axios.create({
  baseURL: '/api', // Points to Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the auth token from localStorage with proper parsing
const getAuthToken = (): string => {
  // Only run this on the client side
  if (typeof window !== 'undefined') {
    try {
      // Get token directly from the Zustand store if possible
      const authState = useAuthStore.getState();
      if (authState && authState.token) {
        return authState.token;
      }
      
      // Fallback to localStorage parsing
      const storedState = localStorage.getItem('user-storage');
      if (storedState) {
        const parsedStorage = JSON.parse(storedState);
        if (parsedStorage && parsedStorage.state) {
          const parsedState = JSON.parse(parsedStorage.state);
          return parsedState.token || '';
        }
      }
    } catch (e) {
      console.error('Error accessing auth token:', e);
    }
  }
  return '';
};

// Complete clear auth function that properly cleans up state
const clearAuth = () => {
  if (typeof window !== 'undefined') {
    try {
      // Clear the Zustand store state
      const { signout } = useAuthStore.getState();
      if (typeof signout === 'function') {
        signout();
      }
      
      // Also remove from localStorage as backup
      localStorage.removeItem('user-storage');
    } catch (e) {
      console.error('Error clearing auth state:', e);
    }
  }
};

// Request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Initialize headers if undefined
    config.headers = config.headers || {};
    
    // Skip adding token for auth endpoints (login/register)
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      console.log('Skipping auth token for auth endpoint:', config.url);
      return config;
    }
    
    // Get current token from Zustand store
    const token = getAuthToken();
    
    // If token exists, add it to the headers
    if (token) {
      // Ensure we're using proper Bearer format for the auth header
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.warn('No auth token available for request:', config.url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      console.error('Unauthorized request, redirecting to login');
      
      // Completely clear auth state
      clearAuth();
      
      // Set a flag to indicate we're being redirected due to auth error
      sessionStorage.setItem('auth_redirected', 'true');
      
      // Redirect to login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
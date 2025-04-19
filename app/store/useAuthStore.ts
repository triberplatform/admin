// /store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RegisterPayload, signinPayLoad } from "../types/payload";
import { RegisterResponse, SigninResponse, User } from "../types/response";
import apiClient from "../lib/api-client";

interface AuthStoreState {
  user: User | null;
  registerResponse: RegisterResponse | null;
  message: string;
  loading: boolean;
  token: string;
  error: string | null;
  success: boolean;
  showErrorModal: boolean;
  isAuthenticated: boolean; // New flag to properly track authentication
  signin: (credentials: signinPayLoad) => Promise<boolean>;
  registerUser: (credentials: RegisterPayload) => Promise<void>;
  signout: () => void;
  clearError: () => void;
  dismissErrorModal: () => void; // New method to only hide modal without clearing error
  getToken: () => string;
  getAuthHeaders: () => Record<string, string>;
  resetAuthState: () => void; // Method to reset auth state on page load
}

// List of transient (non-persisted) state properties
const transientState = ['loading', 'error', 'showErrorModal', 'message', 'success'];

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      registerResponse: null,
      token: "",
      message: "",
      success: false,
      showErrorModal: false,
      isAuthenticated: false, // Initialize as false
      
      // Fixed signin method
      signin: async (credentials) => {
        try {
          set({ 
            loading: true, 
            error: null, 
            showErrorModal: false,
            success: false // Reset success state at the beginning
          });
          
          console.log("Calling signin API with credentials:", credentials);
          
          // Use apiClient to call the Next.js API route
          const response = await apiClient.post('/auth/login', credentials);
          
          console.log("Signin API response:", response.data);
          
          // Check if we have the expected data properties AND successful HTTP status
          if (response.status !== 200 || !response.data.token) {
            throw new Error("Invalid response format or unsuccessful status");
          }
          
          // Extract data from response
          const { token, user } = response.data;
          const responseMessage = response.data.message || "Login successful";
          
          console.log("Processing signin response with token:", !!token);
          
          set({
            user: user,
            token: token,
            loading: false,
            message: responseMessage,
            success: true,
            isAuthenticated: true, // Set authentication status to true
            showErrorModal: false // Ensure error modal is closed on success
          });
          
          return true; // Return success to the component
        } catch (error: any) {
          console.error('Login error:', error);
          
          // Check for different error structures
          const errorMessage = 
            error.response?.data?.data?.error || 
            error.response?.data?.message ||
            error.message || 
            'Authentication failed';
          
          set({
            error: errorMessage,
            loading: false,
            showErrorModal: true,
            message: errorMessage,
            success: false,
            isAuthenticated: false // Ensure auth state is false
          });
          
          return false; // Return failure to the component
        }
      },
      
      // Updated registerUser method
      registerUser: async (credentials) => {
        try {
          set({ 
            loading: true, 
            error: null, 
            showErrorModal: false,
            success: false
          });
          
          // Use apiClient to call the Next.js API route
          const response = await apiClient.post<RegisterResponse>('/auth/register', credentials);
          
          // Only consider success if HTTP status is 200
          if (response.status !== 200) {
            throw new Error("Registration failed with non-200 status");
          }
          
          set({
            registerResponse: response.data,
            loading: false,
            message: response.data.message || "Registration successful",
            success: response.data.success !== undefined ? response.data.success : true
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          
          const errorMessage = 
            error.response?.data?.message ||
            error.response?.data?.data?.message ||
            error.response?.data?.data?.error ||
            error.message ||
            'Registration failed';
          
          set({
            error: errorMessage,
            loading: false,
            showErrorModal: true,
            message: errorMessage,
            success: false
          });
        }
      },
      
      getAuthHeaders: () => {
        const state = get();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (state.token) {
          // Make sure to use the proper Bearer format
          headers['Authorization'] = `Bearer ${state.token}`;
          console.log('Generated auth headers with token');
        } else {
          console.warn('No token available for auth headers');
        }
        
        return headers;
      },
      
      getToken: () => {
        const state = get();
        return state.token || "";
      },
      
      signout: () => {
        set({ 
          user: null, 
          token: "", 
          error: null,
          success: false,
          message: "",
          isAuthenticated: false
        });
      },
      
      clearError: () => {
        set({ 
          error: null, 
          showErrorModal: false 
        });
      },
      
      // New method to dismiss error modal without clearing the error
      dismissErrorModal: () => {
        set({ 
          showErrorModal: false 
        });
      },
      
      // Method to reset authentication state
      resetAuthState: () => {
        // Check if there's an actual valid auth state
        const state = get();
        if (!state.token || !state.user) {
          // Clear potentially invalid auth data
          set({
            isAuthenticated: false,
            token: "",
            user: null
          });
        }
        
        // Always reset error states on page load/refresh, but don't clear persistent data
        set({
          loading: false
        });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => {
        // Make sure localStorage is available (client-side only)
        return typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        };
      }),
      partialize: (state) => 
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !transientState.includes(key))
        ),
    }
  )
);
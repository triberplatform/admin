// stores/userStore.ts
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { Business, dashboardData, dashboardDataDetails, UserAPIResponse, UserAPIResponseDetails, UserData, UserDetails, Pagination } from "../types/response";
import { suspendPayload, searchPayload } from "../types/payload";

interface UserStoreState {
  users: UserData[];
  searchResults: UserData[];
  pagination: Pagination | null;
  dataCount: dashboardDataDetails | null;
  loading: boolean;
  searching: boolean;
  error: string | null;
  message: string;
  success: boolean;
  userDetails: UserDetails | null;
  businessDetails: Business[];
  
  // Actions
  getUsers: (page?: number, limit?: number) => Promise<void>;
  getUsersById: (id: string) => Promise<void>;
  suspendUser: (payload: string) => Promise<void>;
  unsuspendUser: (payload: string) => Promise<void>;
  deleteUser: (publicId: string) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
  getDashboard: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  searchResults: [],
  pagination: null,
  loading: false,
  searching: false,
  error: null,
  message: "",
  success: false,
  userDetails: null,
  businessDetails: [],
  dataCount: null,
  
  getUsers: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      // apiClient automatically includes auth token from authStore
      const response = await apiClient.get<UserAPIResponse>(`/users?page=${page}&limit=${limit}`);
      
      set({
        users: response.data.data.users,
        pagination: response.data.data.metadata,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ 
        searchResults: [],
        searching: false,
      });
      return;
    }
    
    try {
      set({ searching: true, error: null });
      
      const payload: searchPayload = { query };
      
      // Call the search endpoint with the query payload
      const response = await apiClient.post<{
        success: boolean, 
        message: string, 
        data: { users: UserData[] }
      }>('/users/search', payload);
      
      set({
        searchResults: response.data.data.users,
        searching: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search users';
      
      set({
        error: errorMessage,
        searching: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  clearSearch: () => {
    set({ 
      searchResults: [],
      error: null
    });
  },

  getDashboard: async () => {
    try {
      set({ loading: true, error: null });
      
      // apiClient automatically includes auth token from authStore
      const response = await apiClient.get<dashboardData>('/users/dashboard');
      
      set({
        dataCount: response.data.data,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  deleteUser: async (publicId: string) => {
    try {
      set({ loading: true, error: null });
      
      // For debugging
      console.log('Deleting user with publicId:', publicId);
      
      // Call the DELETE endpoint with the userId payload
      // Using query parameter approach for simplicity and reliability
      const response = await apiClient.delete<{message: string, success: boolean}>(`/users/delete?userId=${encodeURIComponent(publicId)}`);
      
      // Remove the deleted user from the state if successful
      if (response.data.success) {
        set((state) => ({
          users: state.users.filter(user => user.publicId !== publicId),
          loading: false,
          message: response.data.message,
          success: response.data.success
        }));
      } else {
        set({
          loading: false,
          message: response.data.message,
          success: response.data.success
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to delete user with ID ${publicId}`;
      console.error('Delete user error:', errorMessage);
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  getUsersById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with the id parameter in the URL path
      const response = await apiClient.get<UserAPIResponseDetails>(`/users/${id}`);
      
      set({
        userDetails: response.data.data,
        businessDetails: response.data.data.businesses,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch user with ID ${id}`;
      
      set({
        error: errorMessage,
        loading: false, 
        message: errorMessage,
        success: false
      });
    }
  },
  
  suspendUser: async (publicId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Create the payload object
      const payload: suspendPayload = { publicId };
      
      // Call the suspension endpoint with the payload
      const response = await apiClient.post('/users/suspend', payload);
      
      set({
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
      
      // If suspension was successful and we're viewing user details, update them
      if (response.data.success && get().userDetails) {
        const userDetails = get().userDetails;
        if (userDetails && userDetails.publicId === publicId) {
          set({
            userDetails: {
              ...userDetails,
              isSuspended: true
            }
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to suspend user`;
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  unsuspendUser: async (publicId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Create the payload object
      const payload: suspendPayload = { publicId };
      
      // Call the unsuspend endpoint with the payload
      const response = await apiClient.post('/users/unsuspend', payload);
      
      set({
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
      
      // If unsuspension was successful and we're viewing user details, update them
      if (response.data.success && get().userDetails) {
        const userDetails = get().userDetails;
        if (userDetails && userDetails.publicId === publicId) {
          set({
            userDetails: {
              ...userDetails,
              isSuspended: false  // Set to false for unsuspension
            }
          });
        }
      }
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to unsuspend user`;
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
      
      return Promise.reject(error);
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
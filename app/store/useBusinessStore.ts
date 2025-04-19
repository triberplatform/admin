// stores/useBusinessStore.ts
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { ApiResponse, ApiResponseAll, BusinessData, DealRoomDetail, FundabilityTestDetail, Pagination } from "../types/response";

interface BusinessStoreState {
  businessDetails: BusinessData | null;
  businesses: BusinessData[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  message: string;
  success: boolean;
  fundabilityDetails: FundabilityTestDetail | null;
  dealRoomDetails: DealRoomDetail | null;
  verifying: boolean;
  
  // Actions
  deleteBusiness: (businessId: string) => Promise<void>;
  getBusinesses: (page?: number, limit?: number) => Promise<void>;
  getBusinessById: (id: string) => Promise<void>;
  verifyBusiness: (businessId: string) => Promise<{ message: string; success: boolean; }>;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessStoreState>((set, get) => ({
  businesses: [],
  pagination: null,
  loading: false,
  verifying: false,
  error: null,
  message: "",
  success: false,
  fundabilityDetails: null,
  dealRoomDetails: null,
  businessDetails: null,
  
  getBusinesses: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with pagination parameters
      const response = await apiClient.get<ApiResponseAll>(`/business?page=${page}&limit=${limit}`);
      
      set({
        businesses: response.data.data.businesses,
        pagination: response.data.data.metadata,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch Business`;
      
      set({
        error: errorMessage,
        loading: false, 
        message: errorMessage,
        success: false
      });
    }
  },
  
  getBusinessById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with the id parameter in the URL path
      const response = await apiClient.get<ApiResponse>(`/business/${id}`);
      
      set({
        businessDetails: response.data.data,
        fundabilityDetails: response.data.data.fundabilityTestDetails,
        dealRoomDetails: response.data.data.dealRoomDetails,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch business with ID ${id}`;
      
      set({
        error: errorMessage,
        loading: false, 
        message: errorMessage,
        success: false
      });
    }
  },
  
  deleteBusiness: async (publicId: string) => {
    try {
      set({ loading: true, error: null });
      
      // For debugging
      console.log('Deleting business with publicId:', publicId);
      
      // Call the DELETE endpoint with the userId payload
      // Using query parameter approach for simplicity and reliability
      const response = await apiClient.delete<{message: string, success: boolean}>(`/business/delete?businessId=${encodeURIComponent(publicId)}`);
      
      // Remove the deleted user from the state if successful
      if (response.data.success) {
        set((state) => ({
          businesses: state.businesses.filter(businesses => businesses.publicId !== publicId),
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
      const errorMessage = error.response?.data?.message || `Failed to delete business with ID ${publicId}`;
      console.error('Delete business error:', errorMessage);
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  verifyBusiness: async (publicId: string) => {
    try {
      set({ verifying: true, error: null });
      
      // For debugging
      console.log('Verifying business with publicId:', publicId);
      
      // Call the verify endpoint
      const response = await apiClient.put<{message: string, success: boolean}>('/business/verify-business', { businessId: publicId });
      
      // Update the business verification status if successful
      if (response.data.success) {
        // Update the businessDetails if we're on the details page
        if (get().businessDetails && get().businessDetails?.publicId === publicId) {
          set({
            businessDetails: {
              ...get().businessDetails!,
              businessVerificationStatus: true
            },
            verifying: false,
            message: response.data.message,
            success: response.data.success
          });
        } 
        
        // Also update the business in the businesses list if it exists there
        set((state) => ({
          businesses: state.businesses.map(business => 
            business.publicId === publicId 
              ? { ...business, businessVerificationStatus: true } 
              : business
          ),
          verifying: false,
          message: response.data.message,
          success: response.data.success
        }));
      } else {
        set({
          verifying: false,
          message: response.data.message,
          success: response.data.success
        });
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to verify business with ID ${publicId}`;
      console.error('Verify business error:', errorMessage);
      
      set({
        error: errorMessage,
        verifying: false,
        message: errorMessage,
        success: false
      });
      
      throw error; // Re-throw to allow handling in the component
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
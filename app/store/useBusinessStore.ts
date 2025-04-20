import { create } from "zustand";
import apiClient from "../lib/api-client";
import { ApiResponse, ApiResponseAll, BusinessData, DealRoomDetail, FundabilityTestDetail, Pagination, StartupTestDetails } from "../types/response";

interface SearchPayload {
  query: string;
}

interface EditBusinessPayload {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  location: string;
  industry: string;
  yearEstablished: number;
  businessLegalEntity: string;
  description: string;
  interestedIn?: string;
  numOfEmployees?: string;
  assets?: string;
  reportedSales?: string;
  businessStage?: string;
  businessStatus?: string;
}

interface BusinessStoreState {
  businessDetails: BusinessData | null;
  businesses: BusinessData[];
  searchResults: BusinessData[];
  pagination: Pagination | null;
  loading: boolean;
  searching: boolean;
  editing: boolean;
  error: string | null;
  message: string;
  success: boolean;
  fundabilityDetails: FundabilityTestDetail | null;
  startupTestDetails: StartupTestDetails | null;
  dealRoomDetails: DealRoomDetail | null;
  verifying: boolean;
  
  // Actions
  deleteBusiness: (businessId: string) => Promise<void>;
  getBusinesses: (page?: number, limit?: number) => Promise<void>;
  getBusinessById: (id: string) => Promise<void>;
  verifyBusiness: (businessId: string) => Promise<{ message: string; success: boolean; }>;
  editBusiness: (businessId: string, data: EditBusinessPayload) => Promise<{ message: string; success: boolean; data?: BusinessData }>;
  searchBusinesses: (query: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessStoreState>((set, get) => ({
  businesses: [],
  searchResults: [],
  pagination: null,
  loading: false,
  searching: false,
  verifying: false,
  editing: false,
  error: null,
  message: "",
  success: false,
  fundabilityDetails: null,
  dealRoomDetails: null,
  businessDetails: null,
  startupTestDetails: null,
  
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
  
  searchBusinesses: async (query: string) => {
    if (!query.trim()) {
      set({ 
        searchResults: [],
        searching: false,
      });
      return;
    }
    
    try {
      set({ searching: true, error: null });
      
      const payload: SearchPayload = { query };
      
      // Call the search endpoint with the query payload
      const response = await apiClient.post<{
        success: boolean, 
        message: string, 
        data: BusinessData[] // Expecting an array of business data directly
      }>('/business/search', payload);
      
      // Log the response structure for debugging
      console.log("Business search API response:", response.data);
      
      set({
        searchResults: response.data.data,
        searching: false,
        message: response.data.message,
        success: response.data.success
      });
      
      // Log the updated search results
      console.log("Business search results set to:", response.data.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search businesses';
      console.error("Business search error:", errorMessage);
      
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
  
  getBusinessById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with the id parameter in the URL path
      const response = await apiClient.get<ApiResponse>(`/business/${id}`);
      
      set({
        businessDetails: response.data.data,
        fundabilityDetails: response.data.data.fundabilityTestDetails,
        startupTestDetails: response.data.data.startupTestDetails,
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
  
  editBusiness: async (publicId: string, data: EditBusinessPayload) => {
    try {
      set({ editing: true, error: null });
      
      // For debugging
      console.log('Editing business with publicId:', publicId);
      console.log('Edit business payload:', data);
      
      // Call the edit endpoint
      const response = await apiClient.put<{
        success: boolean, 
        message: string, 
        data: BusinessData
      }>(`/business/edit/${publicId}`, data);
      
      // Update the business details if successful
      if (response.data.success) {
        // Get the updated business data from the response
        const updatedBusinessData = response.data.data;
        
        // Update the businessDetails if we're on the details page
        if (get().businessDetails && get().businessDetails?.publicId === publicId) {
          set({
            businessDetails: {
              ...get().businessDetails!,
              ...updatedBusinessData
            },
            editing: false,
            message: response.data.message,
            success: response.data.success
          });
        } 
        
        // Also update the business in the businesses list if it exists there
        set((state) => ({
          businesses: state.businesses.map(business => 
            business.publicId === publicId 
              ? { ...business, ...updatedBusinessData } 
              : business
          ),
          editing: false,
          message: response.data.message,
          success: response.data.success
        }));
      } else {
        set({
          editing: false,
          message: response.data.message,
          success: response.data.success
        });
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to edit business with ID ${publicId}`;
      console.error('Edit business error:', errorMessage);
      
      set({
        error: errorMessage,
        editing: false,
        message: errorMessage,
        success: false
      });
      
      throw error; // Re-throw to allow handling in the component
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
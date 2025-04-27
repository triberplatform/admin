// useBusinessStore.ts
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { 
  ApiResponse, 
  ApiResponseAll, 
  BusinessData, 
  BusinessProposalsResponse, 
  DealRoomDetail, 
  FundabilityTestDetail, 
  Pagination, 
  ProposalRecievedBusiness, 
  ProposalSentBusiness, 
  ProposalsRecievedResponse, 
  StartupTestDetails 
} from "../types/response";
import { EditBusinessDealRoomRPayload } from "../types/payload";

interface SearchPayload {
  query: string;
}

interface SuspendPayload {
  publicId: string;
}

interface SuspendBusinessPayload {
  businessId: string;
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

interface EditBusinessDealRoomResponse {
  id: number;
  publicId: string;
  businessId: string;
  topSellingProducts: string[];
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: string;
  reportedYearlySales: string;
  profitMarginPercentage: number;
  assetsDetails: string[];
  valueOfPhysicalAssets: string;
  tentativeSellingPrice: string;
  reasonForSale: string;
  businessPhotos: string[];
  proofOfBusiness: string;
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
}

interface BusinessStoreState {
  businessDetails: BusinessData | null;
  businesses: BusinessData[];
  proposals: ProposalSentBusiness[];
  searchResults: BusinessData[];
  pagination: Pagination | null;
  loading: boolean;
  loadingProposals: boolean; // Separate loading state for proposals
  searching: boolean;
  editing: boolean;
  editingDealRoom: boolean; // New state for deal room editing
  suspending: boolean;
  error: string | null;
  errorProposals: string | null; // Separate error state for proposals
  proposalsRecieved: ProposalRecievedBusiness[];
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
  getProposalsSent: (id: string) => Promise<void>;
  getProposalsRecieved: (id: string) => Promise<void>;
  verifyBusiness: (businessId: string) => Promise<{ message: string; success: boolean; }>;
  editBusiness: (businessId: string, data: EditBusinessPayload) => Promise<{ message: string; success: boolean; data?: BusinessData }>;
  editDealRoomProfile: (businessId: string, data: EditBusinessDealRoomRPayload) => Promise<{ message: string; success: boolean; data?: EditBusinessDealRoomResponse }>;
  suspendBusiness: (businessId: string) => Promise<{ message: string; success: boolean; }>;
  unsuspendBusiness: (businessId: string) => Promise<{ message: string; success: boolean; }>;
  searchBusinesses: (query: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessStoreState>((set, get) => ({
  businesses: [],
  proposalsRecieved: [],
  searchResults: [],
  pagination: null,
  loading: false,
  loadingProposals: false,
  searching: false,
  verifying: false,
  editing: false,
  editingDealRoom: false,
  suspending: false,
  error: null,
  errorProposals: null,
  message: "",
  success: false,
  fundabilityDetails: null,
  dealRoomDetails: null,
  businessDetails: null,
  startupTestDetails: null,
  proposals: [],
  
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
  
  getProposalsSent: async (id: string) => {
    try {
      set({ loadingProposals: true, errorProposals: null });
      
      // Call the API endpoint with the id parameter in the URL path
      const response = await apiClient.get<BusinessProposalsResponse>(`/business/proposals-sent/${id}`);
      
      set({
        proposals: response.data.data,
        loadingProposals: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch proposals for business with ID ${id}`;
      
      set({
        errorProposals: errorMessage,
        loadingProposals: false, 
        message: errorMessage,
        success: false
      });
    }
  },

  getProposalsRecieved: async (id: string) => {
    try {
      set({ loadingProposals: true, errorProposals: null });
      
      // Call the API endpoint with the id parameter in the URL path
      const response = await apiClient.get<ProposalsRecievedResponse>(`/business/proposals-recieved/${id}`);
      
      set({
        proposalsRecieved: response.data.data,
        loadingProposals: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch proposals for business with ID ${id}`;
      
      set({
        errorProposals: errorMessage,
        loadingProposals: false, 
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
  
  suspendBusiness: async (businessId: string) => {
    try {
      set({ suspending: true, error: null });
      // Create the payload object
      const payload: SuspendBusinessPayload = { businessId };
      
      // Call the suspension endpoint with the payload
      const response = await apiClient.put<{message: string, success: boolean}>('/business/suspend', payload);
      
      // If suspension was successful and we're viewing business details, update them
      if (response.data.success && get().businessDetails) {
        const businessDetails = get().businessDetails;
        if (businessDetails && businessDetails.publicId === businessId) {
          set({
            businessDetails: {
              ...businessDetails,
              isSuspended: true
            }
          });
        }
      }
      
      set({
        suspending: false,
        message: response.data.message,
        success: response.data.success
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to suspend business`;
      console.error('Suspend business error:', errorMessage);
      
      set({
        error: errorMessage,
        suspending: false,
        message: errorMessage,
        success: false
      });
      
      throw error; // Re-throw to allow handling in the component
    }
  },
  
  unsuspendBusiness: async (businessId: string) => {
    try {
      set({ suspending: true, error: null });
      
      // Create the payload object
      const payload: SuspendBusinessPayload = { businessId };
      
      // Call the unsuspend endpoint with the payload
      const response = await apiClient.put<{message: string, success: boolean}>('/business/unsuspend', payload);
      
      // If unsuspension was successful and we're viewing business details, update them
      if (response.data.success && get().businessDetails) {
        const businessDetails = get().businessDetails;
        if (businessDetails && businessDetails.publicId === businessId) {
          set({
            businessDetails: {
              ...businessDetails,
              isSuspended: false
            }
          });
        }
      }
      
      set({
        suspending: false,
        message: response.data.message,
        success: response.data.success
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to unsuspend business`;
      console.error('Unsuspend business error:', errorMessage);
      
      set({
        error: errorMessage,
        suspending: false,
        message: errorMessage,
        success: false
      });
      
      throw error; // Re-throw to allow handling in the component
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
  
  // New function for editing deal room profile
  editDealRoomProfile: async (businessId: string, data: EditBusinessDealRoomRPayload) => {
    try {
      set({ editingDealRoom: true, error: null });
      
      // For debugging
      console.log('Editing dealroom profile with businessId:', businessId);
      console.log('Edit dealroom payload:', data);
      
      // Call the edit endpoint
      const response = await apiClient.put<{
        success: boolean, 
        message: string, 
        data: EditBusinessDealRoomResponse
      }>(`/business/edit-dealroom/${businessId}`, data);
      
      // Update the business details if successful
      if (response.data.success) {
        // Get the updated deal room data from the response
        const updatedDealRoomData = response.data.data;
        
        // Update the dealRoomDetails if we're on the details page
        if (get().businessDetails && get().businessDetails?.publicId === businessId) {
          set({
            dealRoomDetails: updatedDealRoomData,
            editingDealRoom: false,
            message: response.data.message,
            success: response.data.success
          });
        }
      } else {
        set({
          editingDealRoom: false,
          message: response.data.message,
          success: response.data.success
        });
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to edit dealroom profile for business with ID ${businessId}`;
      console.error('Edit dealroom profile error:', errorMessage);
      
      set({
        error: errorMessage,
        editingDealRoom: false,
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
    set({ error: null, errorProposals: null });
  }
}));
// src/app/store/useFundabilityStore.ts
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { 
  FundabilityTestResponse, 
  FundabilityTestResponseStartUp, 
  FundabilityTestSME, 
  FundabilityTestStartup, 
  Pagination 
} from "../types/response";

interface FundabilityStoreState {
  fundabilityTestStartUp: FundabilityTestStartup[];
  fundabilityTestSme: FundabilityTestSME[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  message: string;
  success: boolean;
  
  // Actions
  getFundabilityTestSme: (page?: number, limit?: number) => Promise<void>;
  getFundabilityTestStartUp: (page?: number, limit?: number) => Promise<void>;
  updateScore: (score: number, fundabilityId: string, reason?: string) => Promise<void>;
  clearError: () => void;
}

export const useFundabilityStore = create<FundabilityStoreState>((set, get) => ({
  fundabilityTestStartUp: [],
  fundabilityTestSme: [],
  pagination: null,
  loading: false,
  error: null,
  message: "",
  success: false,
  
  getFundabilityTestSme: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with pagination parameters
      const response = await apiClient.get<FundabilityTestResponse>(
        `/fundability/sme?page=${page}&limit=${limit}`
      );
      
      set({
        fundabilityTestSme: response.data.data.fundabilityTests,
        pagination: response.data.data.metadata,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch SME fundability tests`;
      
      set({
        error: errorMessage,
        loading: false, 
        message: errorMessage,
        success: false
      });
    }
  },
  
  getFundabilityTestStartUp: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      // Call the API endpoint with pagination parameters
      const response = await apiClient.get<FundabilityTestResponseStartUp>(
        `/fundability/startup?page=${page}&limit=${limit}`
      );
      
      set({
        fundabilityTestStartUp: response.data.data.fundabilityTests,
        pagination: response.data.data.metadata,
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to fetch Startup fundability tests`;
      
      set({
        error: errorMessage,
        loading: false, 
        message: errorMessage,
        success: false
      });
    }
  },
  
  updateScore: async (score: number, fundabilityId: string, reason?: string) => {
    try {
      set({ loading: true, error: null });
      
      // Create the payload object - only sending score to the API
      const payload = {
        score,
        fundabilityId // Needed to construct the API route
      };
      
      // Call the update score endpoint with the payload
      const response = await apiClient.post('/fundability/update', payload);
      
      set({
        loading: false,
        message: response.data.message,
        success: response.data.success
      });
      
      // Refresh the lists to show updated scores
      // We'll use the current page and limit from the store
      const { getFundabilityTestSme, getFundabilityTestStartUp } = get();
      await getFundabilityTestSme();
      await getFundabilityTestStartUp();
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to update fundability score`;
      
      set({
        error: errorMessage,
        loading: false,
        message: errorMessage,
        success: false
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
// src/app/store/useInvestorStore.ts 
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { 
  Investor, 
  InvestorApiResponse, 
  InvestorProposalSent, 
  InvestorProposalsSent, 
  InvestorProposalReceived, 
  InvestorProposalsReceived 
} from "../types/response";

interface InvestorState {
    investors: Investor[];
    investor: Investor | null;
    searchResults: Investor[];
    proposals: InvestorProposalSent[]; // Proposals sent
    proposalsReceived: InvestorProposalReceived[]; // Proposals received
    loading: boolean;
    actionLoading: boolean;
    loadingProposals: boolean; // Loading state for proposals sent
    loadingProposalsReceived: boolean; // Loading state for proposals received
    searching: boolean;
    error: string | null;
    errorProposals: string | null; // Error state for proposals sent
    errorProposalsReceived: string | null; // Error state for proposals received
    message: string;
    success: boolean;

    // Actions
    getInvestors: () => Promise<void>;
    getInvestorById: (id: string) => Promise<void>;
    getProposalsSent: (id: string) => Promise<void>; // Get proposals sent
    getProposalsReceived: (id: string) => Promise<void>; // Get proposals received
    searchInvestors: (query: string) => Promise<void>;
    clearSearch: () => void;
}

export const useInvestorStore = create<InvestorState>((set, get) => ({
    investors: [],
    investor: null,
    searchResults: [],
    proposals: [], // Initialize proposals sent array
    proposalsReceived: [], // Initialize proposals received array
    loading: false,
    actionLoading: false,
    loadingProposals: false, // Initialize loading state for proposals sent
    loadingProposalsReceived: false, // Initialize loading state for proposals received
    searching: false,
    error: null,
    errorProposals: null, // Initialize error state for proposals sent
    errorProposalsReceived: null, // Initialize error state for proposals received
    message: "",
    success: false,

    getInvestors: async () => {
        try {
            set({ loading: true, error: null });
            
            // Call the API endpoint
            const response = await apiClient.get<InvestorApiResponse>(
                `/investors`
            );
            
            console.log("Investors fetched successfully:", response.data);
            
            set({
                investors: response.data.data,
                loading: false,
                message: response.data.message,
                success: response.data.success
            });
        } catch (error: any) {
            console.error("Error fetching investors:", error);
            const errorMessage = error.response?.data?.message || `Failed to fetch investors`;
            
            set({
                error: errorMessage,
                loading: false,
                message: errorMessage,
                success: false
            });
        }
    },

    getInvestorById: async (id: string) => {
        try {
            set({ loading: true, error: null });
            
            console.log("Fetching investor with ID:", id);
            
            // Call the API endpoint for a single investor - using the correct API path
            const response = await apiClient.get<{
                success: boolean;
                message: string;
                data: Investor;
            }>(`/investors/${id}`);
            
            console.log("Investor details fetched successfully:", response.data);
            
            set({
                investor: response.data.data,
                loading: false,
                message: response.data.message,
                success: response.data.success
            });
        } catch (error: any) {
            console.error("Error fetching investor details:", error);
            const errorMessage = error.response?.data?.message || `Failed to fetch investor details`;
            
            set({
                error: errorMessage,
                loading: false,
                message: errorMessage,
                success: false,
                investor: null
            });
        }
    },
    
    getProposalsSent: async (id: string) => {
        try {
          set({ loadingProposals: true, errorProposals: null });
          
          console.log("Fetching proposals sent by investor with ID:", id);
          
          // Call the API endpoint with the id parameter in the URL path
          const response = await apiClient.get<InvestorProposalsSent>(`/investors/proposals-sent/${id}`);
          
          console.log("Proposals sent fetched successfully:", response.data);
          
          set({
            proposals: response.data.data,
            loadingProposals: false,
            message: response.data.message,
            success: response.data.success
          });
        } catch (error: any) {
          console.error("Error fetching proposals sent:", error);
          const errorMessage = error.response?.data?.message || `Failed to fetch proposals for investor with ID ${id}`;
          
          set({
            errorProposals: errorMessage,
            loadingProposals: false, 
            message: errorMessage,
            success: false
          });
        }
    },
    
    getProposalsReceived: async (id: string) => {
        try {
          set({ loadingProposalsReceived: true, errorProposalsReceived: null });
          
          console.log("Fetching proposals received by investor with ID:", id);
          
          // Call the API endpoint with the id parameter in the URL path
          const response = await apiClient.get<InvestorProposalsReceived>(`/investors/proposals-recieved/${id}`);
          
          console.log("Proposals received fetched successfully:", response.data);
          
          set({
            proposalsReceived: response.data.data,
            loadingProposalsReceived: false,
            message: response.data.message,
            success: response.data.success
          });
        } catch (error: any) {
          console.error("Error fetching proposals received:", error);
          const errorMessage = error.response?.data?.message || `Failed to fetch received proposals for investor with ID ${id}`;
          
          set({
            errorProposalsReceived: errorMessage,
            loadingProposalsReceived: false, 
            message: errorMessage,
            success: false
          });
        }
    },

    searchInvestors: async (query: string) => {
        try {
            set({ searching: true, error: null });

            // For now, perform client-side filtering (can be replaced with server-side search endpoint)
            const state = get();
            
            const results = state.investors.filter(investor => {
                const searchTerms = query.toLowerCase().split(' ');
                
                // Search across multiple fields
                const companyName = investor.companyName?.toLowerCase() || '';
                const email = investor.email?.toLowerCase() || '';
                const location = investor.location?.toLowerCase() || '';
                const about = investor.about?.toLowerCase() || '';
                
                // Check if all search terms match any of the fields
                return searchTerms.every(term => 
                    companyName.includes(term) || 
                    email.includes(term) || 
                    location.includes(term) || 
                    about.includes(term)
                );
            });
            
            set({
                searchResults: results,
                searching: false,
            });
        } catch (error: any) {
            console.error("Error searching investors:", error);
            set({
                error: "Error searching investors",
                searching: false,
            });
        }
    },

    clearSearch: () => {
        set({ searchResults: [], searching: false });
    }
}));
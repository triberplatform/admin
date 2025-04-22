// src/app/store/useInvestorStore.ts 
import { create } from "zustand";
import apiClient from "../lib/api-client";
import { Investor, InvestorApiResponse } from "../types/response";

interface InvestorState {
    investors: Investor[];
    investor: Investor | null;
    searchResults: Investor[];
    loading: boolean;
    actionLoading: boolean;
    searching: boolean;
    error: string | null;
    message: string;
    success: boolean;

    // Actions
    getInvestors: () => Promise<void>;
    getInvestorById: (id: string) => Promise<void>;
    searchInvestors: (query: string) => Promise<void>;
    clearSearch: () => void;
}

export const useInvestorStore = create<InvestorState>((set, get) => ({
    investors: [],
    investor: null,
    searchResults: [],
    loading: false,
    actionLoading: false,
    searching: false,
    error: null,
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
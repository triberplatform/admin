"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/app/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/Table";
import { Pen, ChevronLeft, ChevronRight, Search, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useInvestorStore } from "@/app/store/useInvestorStore";
import { format } from "date-fns";
import { Investor } from "@/app/types/response";
import Loading from "@/app/loading";

export default function InvestorsPage(): React.ReactElement {
  const { 
    investors, 
    searchResults,
    loading,
    searching,
    error,
    getInvestors,
    searchInvestors,
    clearSearch
  } = useInvestorStore();
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // When search is active, only show search results. Otherwise show regular investors.
  const displayInvestors = isSearchActive ? searchResults : investors;
  
  // Format date function
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "d MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };



  // Fix: Memoize the handleSearch function with useCallback
  const handleSearch = useCallback(async () => {
    if (query.trim()) {
      await searchInvestors(query);
      // Activate search mode when we have results
      setIsSearchActive(true);
    }
  }, [query, searchInvestors, setIsSearchActive]);
  
  // Handle clear with useCallback too for consistency
  const handleClear = useCallback(() => {
    setQuery("");
    clearSearch();
    setIsSearchActive(false);
  }, [clearSearch, setIsSearchActive]);

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    const totalItems = displayInvestors?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvestors = displayInvestors?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalInvestors = displayInvestors?.length || 0;
  const totalPages = Math.ceil(totalInvestors / itemsPerPage);

  useEffect(() => {
    if (!isSearchActive) {
      getInvestors();
    }
  }, [getInvestors, isSearchActive]);
  
  // Fix: Add the missing dependencies to the useEffect's dependency array
  useEffect(() => {
    // Debounce search function
    if (query.trim()) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      
      searchTimeout.current = setTimeout(() => {
        handleSearch();
      }, 500); // 500ms debounce
    } else {
      clearSearch();
      setIsSearchActive(false);
    }
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, handleSearch, clearSearch, setIsSearchActive]);
  
  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <div className="mt-5">
        <div className="flex justify-between items-center mb-5">
          <p className="font-semibold text-lg">Investors</p>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button 
              onClick={() => {
                if (isSearchActive) {
                  // If search is active, re-run search
                  if (query.trim()) {
                    searchInvestors(query);
                  }
                } else {
                  // If not in search mode, refresh investors list
                  getInvestors();
                }
              }}
              className="px-4 py-2 text-sm border border-gray-300 text-mainGreen rounded-md flex items-center gap-2 hover:bg-gray-50"
              disabled={loading || searching}
            >
              <RefreshCw size={16} className={(loading || searching) ? "animate-spin" : ""} />
              Refresh
            </button>
            
            {/* Integrated Search Component */}
            <div className="relative w-full max-w-md">
              <div className={`flex items-center border rounded-md overflow-hidden transition-all ${isSearchInputActive ? 'ring-2 ring-blue-300' : ''}`}>
                <div className="flex items-center justify-center pl-3">
                  <Search size={18} className="text-gray-400" />
                </div>
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchInputActive(true)}
                  onBlur={() => setIsSearchInputActive(false)}
                  placeholder="Search investors by name, email or location..."
                  className="w-full py-2 px-3 outline-none text-sm"
                />
                
                {query && (
                  <button 
                    onClick={handleClear} 
                    className="flex items-center justify-center pr-3"
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              {searching && (
                <div className="absolute right-3 top-2.5">
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          {(loading && !searching) && <Loading isVisible={true} />}
          {error && <p className="text-red-500">{error}</p>}
          
          {isSearchActive && searchResults && (
            <p className="text-sm text-gray-500">
              Found {searchResults.length} investor{searchResults.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>Company</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Funds Under Management</TableHeader>
              <TableHeader>Joined</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {currentInvestors && currentInvestors.length > 0 ? (
              currentInvestors.map((investor: Investor) => (
                <TableRow 
                  key={investor.publicId}
                  link={`/dashboard/investors/details?investorId=${investor.publicId}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {investor.companyLogoUrl && (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img 
                            src={investor.companyLogoUrl} 
                            alt={`${investor.companyName} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-logo.png'; // Fallback image
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{investor.companyName || "-"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{investor.email || "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {investor.companyType.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>{investor.location || "-"}</TableCell>
                  <TableCell>₦{investor.fundsUnderManagement}</TableCell>
                  <TableCell>{formatDate(investor.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Link href={`/dashboard/investors/details?investorId=${investor.publicId}`}>
                        <Pen size={16} className="cursor-pointer" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell  className="text-center py-4">
                  {loading ? "Loading investors..." : 
                   searching ? "Searching..." : 
                   isSearchActive ? "No matching investors found" : "No investors found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination - Shown when there are investors to display */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalInvestors)} of {totalInvestors} entries
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm">Show</span>
                <select 
                  value={itemsPerPage} 
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded p-1 text-sm"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm">entries</span>
              </div>
              
              {/* Pagination buttons */}
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page numbers - show up to 5 page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all pages
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If current page is among first 3, show pages 1-5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If current page is among last 3, show last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Otherwise show 2 pages before and 2 pages after current
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNum 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
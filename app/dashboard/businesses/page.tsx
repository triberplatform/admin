"use client";
import React, { useEffect, useState, useRef } from "react";
import Header from "@/app/components/Header";
import Breadcrumb from "@/app/components/BreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/Table";
import CircularProgress from "@/app/components/CircularProgress";
import { useBusinessStore } from "@/app/store/useBusinessStore";
import { Briefcase, Trash2, FileText, RefreshCw, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Link from "next/link";
import { BusinessData } from "@/app/types/response";
import Loading from "@/app/loading";

// Document count badge component
const DocumentCountBadge: React.FC<{ business: BusinessData }> = ({ business }) => {
  // Count available documents
  const countDocuments = (): number => {
    if (!business.fundabilityTestDetails?.docs) return 0;
    
    return Object.values(business.fundabilityTestDetails.docs).filter(Boolean).length;
  };

  const docCount = countDocuments();
  
  return (
    <div className="flex items-center">
      <FileText size={15} className="text-gray-600 mr-1" />
      <span className="text-sm">{docCount}</span>
    </div>
  );
};

// Confirmation modal for delete
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  businessName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  businessName,
  isDeleting 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete <span className="font-semibold">{businessName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Success modal component
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  businessName 
}) => {
  // Fix: Move useEffect outside of conditional rendering
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {/* Success checkmark */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Successfully Deleted</h2>
          <p className="mb-4 text-gray-600">
            <span className="font-semibold">{businessName}</span> has been successfully deleted.
          </p>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Fix 1: Define handleSearch outside the component or use useCallback
// Fix 2: Add clearSearch and handleSearch to the dependency array

export default function BusinessesPage() {
  const { 
    businesses, 
    searchResults, 
    pagination, 
    loading, 
    searching, 
    error, 
    getBusinesses, 
    deleteBusiness,
    searchBusinesses,
    clearSearch 
  } = useBusinessStore();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [businessToDelete, setBusinessToDelete] = useState<BusinessData | null>(null);
  const [deletedBusinessName, setDeletedBusinessName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Search states
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Determine which businesses data to show based on whether search is active
  const displayBusinesses = isSearchActive ? searchResults : businesses;

  // Fix: Use useCallback to memoize the handleSearch function
  const handleSearch = React.useCallback(async () => {
    if (query.trim()) {
      await searchBusinesses(query);
      console.log("Search results:", searchResults);
      // Activate search mode when search is executed
      setIsSearchActive(true);
    }
  }, [query, searchBusinesses, setIsSearchActive]); // Add all dependencies

  // Fetch businesses on component mount and when pagination changes
  useEffect(() => {
    if (!isSearchActive) {
      getBusinesses(currentPage, itemsPerPage);
    }
  }, [getBusinesses, currentPage, itemsPerPage, isSearchActive]);
  
  // Handle search with debounce - Fix: Add the missing dependencies
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
  }, [query, handleSearch, clearSearch, setIsSearchActive]); // Added missing dependencies
  
  // Log search results whenever they change
  useEffect(() => {
    console.log("Current business search results:", searchResults);
  }, [searchResults]);

  const handleClear = () => {
    setQuery("");
    clearSearch();
    setIsSearchActive(false);
  };



  // Handle delete button click
  const handleDeleteClick = (business: BusinessData) => {
    setBusinessToDelete(business);
    setIsDeleteModalOpen(true);
  };

  // Handle confirmation of delete
  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;
    
    try {
      setIsDeleting(true);
      // Store the business name for success message
      const businessNameToDelete = businessToDelete.businessName;
      
      // Call the delete business API endpoint
      await deleteBusiness(businessToDelete.publicId);
      
      // On success, close the delete modal and open success modal
      setIsDeleteModalOpen(false);
      setDeletedBusinessName(businessNameToDelete);
      setIsSuccessModalOpen(true);
      setBusinessToDelete(null);
      
      // Refresh businesses list isn't needed since the store filters out the deleted business
    } catch (error) {
      console.error('Error deleting business:', error);
      // You could show an error message here
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    if (pagination && newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />
      <Loading isVisible={loading && !isDeleting} />
      
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold flex gap-1 items-center">
            <Briefcase size={15} /> Businesses
          </p>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button 
              onClick={() => {
                if (isSearchActive) {
                  // If search is active, re-run search
                  if (query.trim()) {
                    searchBusinesses(query);
                  }
                } else {
                  // If not in search mode, refresh businesses list
                  getBusinesses(currentPage, itemsPerPage);
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
                  placeholder="Search businesses by name, email or industry..."
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
          {error && <p className="text-red-500">{error}</p>}
          
          {isSearchActive && searchResults && (
            <p className="text-sm text-gray-500">
              Found {searchResults.length} business{searchResults.length !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
        
        {error && !isSearchActive ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => getBusinesses(currentPage, itemsPerPage)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableHeader>Business Name</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Industry</TableHeader>
                <TableHeader>Documents</TableHeader>
                <TableHeader>Fundability Score</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayBusinesses.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500">
                    {loading ? "Loading businesses..." : 
                     searching ? "Searching..." : 
                     isSearchActive ? "No matching businesses found" : "No businesses available."}
                  </TableCell>
                </TableRow>
              ) : (
                displayBusinesses.map((business: BusinessData) => (
                  <TableRow 
                    key={business.publicId} 
                    link={`/dashboard/businesses/business-details?id=${business.publicId}`}
                  >
                    <TableCell>{business.businessName}</TableCell>
                    <TableCell>{business.businessStage}</TableCell>
                    <TableCell>{business.businessEmail}</TableCell>
                    <TableCell>{business.industry.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <DocumentCountBadge business={business} />
                    </TableCell>
                    <TableCell>
                      <CircularProgress 
                        percentage={business.fundabilityTestDetails?.score ?? 0} 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteClick(business);
                          }}
                          className="rounded-full border border-red-700 bg-red-700/20 w-6 h-6 flex items-center justify-center text-red-700 hover:bg-red-700/30 transition-colors"
                          title="Delete business"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination Controls - Only show when not in search mode */}
        {!isSearchActive && pagination && pagination.totalPages > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} entries
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
                  <option value={10}>10</option>
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
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    // If 5 or fewer pages, show all pages
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If current page is among first 3, show pages 1-5
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    // If current page is among last 3, show last 5 pages
                    pageNum = pagination.totalPages - 4 + i;
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
                  disabled={currentPage === pagination.totalPages}
                  className={`p-1 rounded ${currentPage === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        businessName={businessToDelete?.businessName || ""}
        isDeleting={isDeleting}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        businessName={deletedBusinessName}
      />
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
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
import { useFundabilityStore } from "@/app/store/useFundabilityStore";
import { Briefcase, Trash2, FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FundabilityTestSME, FundabilityTestStartup } from "@/app/types/response";
import Loading from "@/app/loading";

// Tab component for switching between SME and Startup views
interface TabProps {
  active: string;
  setActive: (tab: string) => void;
}

const Tabs: React.FC<TabProps> = ({ active, setActive }) => {
  return (
    <div className="flex border-b mb-6">
      <button
        className={`px-4 py-2 ${
          active === "sme" 
            ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
            : "text-gray-600 hover:text-gray-800"
        }`}
        onClick={() => setActive("sme")}
      >
        SMEs
      </button>
      <button
        className={`px-4 py-2 ${
          active === "startup" 
            ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
            : "text-gray-600 hover:text-gray-800"
        }`}
        onClick={() => setActive("startup")}
      >
        Startups
      </button>
    </div>
  );
};

// Document count badge component
const DocumentCountBadge: React.FC<{ docs: any }> = ({ docs }) => {
  // Count available documents
  const countDocuments = (): number => {
    if (!docs) return 0;
    
    return Object.values(docs).filter(Boolean).length;
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
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, businessName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete the fundability test for <span className="font-semibold">{businessName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FundabilityTestsPage() {
  const { 
    fundabilityTestStartUp, 
    fundabilityTestSme, 
    pagination, 
    loading, 
    error, 
    getFundabilityTestSme,
    getFundabilityTestStartUp
  } = useFundabilityStore();
  
  const [activeTab, setActiveTab] = useState<string>("sme");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [testToDelete, setTestToDelete] = useState<FundabilityTestSME | FundabilityTestStartup | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch fundability tests data based on active tab
  useEffect(() => {
    if (activeTab === "sme") {
      getFundabilityTestSme(currentPage, itemsPerPage);
    } else {
      getFundabilityTestStartUp(currentPage, itemsPerPage);
    }
  }, [getFundabilityTestSme, getFundabilityTestStartUp, activeTab, currentPage, itemsPerPage]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Handle delete button click
  const handleDeleteClick = (test: FundabilityTestSME | FundabilityTestStartup) => {
    setTestToDelete(test);
    setIsDeleteModalOpen(true);
  };

  // Handle confirmation of delete
  const handleConfirmDelete = () => {
    // In a real implementation, you would call an API to delete the test
    console.log(`Deleting fundability test for: ${testToDelete?.legalName}`);
    
    // Close the modal
    setIsDeleteModalOpen(false);
    setTestToDelete(null);
    
    // Refresh the list (in a real implementation, you might not need this if your state management handles it)
    if (activeTab === "sme") {
      getFundabilityTestSme(currentPage, itemsPerPage);
    } else {
      getFundabilityTestStartUp(currentPage, itemsPerPage);
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

  // Refresh data
  const refreshData = () => {
    if (activeTab === "sme") {
      getFundabilityTestSme(currentPage, itemsPerPage);
    } else {
      getFundabilityTestStartUp(currentPage, itemsPerPage);
    }
  };

  // Get current data based on active tab
  const currentData = activeTab === "sme" ? fundabilityTestSme : fundabilityTestStartUp;

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />
      <Loading isVisible={loading} />
      
      <div className="mt-10">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold flex gap-1 items-center">
            <Briefcase size={15} /> Fundability Tests
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={refreshData}
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs active={activeTab} setActive={handleTabChange} />
        
        {
         error ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={refreshData}
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
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500">
                    No fundability tests available.
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((test) => (
                  <TableRow 
                    key={test.publicId} 
                    link={`/dashboard/fundability-tests/fundability-details?id=${test.businessId}&type=${activeTab}`}
                  >
                    <TableCell>{test.legalName}</TableCell>
                    <TableCell>{activeTab === "sme" ? "SME" : "Startup"}</TableCell>
                    <TableCell>{test.companyEmail}</TableCell>
                    <TableCell>{test.industry.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <DocumentCountBadge docs={test.docs} />
                    </TableCell>
                    <TableCell>
                      <CircularProgress percentage={test.score} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteClick(test);
                          }}
                          className="rounded-full border border-red-700 bg-red-700/20 w-6 h-6 flex items-center justify-center text-red-700 hover:bg-red-700/30 transition-colors"
                          title="Delete fundability test"
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

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 0 && (
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
        businessName={testToDelete?.legalName || ""}
      />
    </div>
  );
}
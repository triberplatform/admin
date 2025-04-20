"use client";
import React, { useEffect, useState, useRef } from "react";
import Header from "@/app/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/Table";
import { Pen, Trash2, ChevronLeft, ChevronRight, AlertCircle, Search, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import { format } from "date-fns";
import { UserData } from "@/app/types/response";
import Loading from "@/app/loading";

export default function UsersPage(): React.ReactElement {
  const { 
    users, 
    searchResults, 
    pagination, 
    loading, 
    searching, 
    error, 
    getUsers, 
    deleteUser,
    searchUsers,
    clearSearch 
  } = useUserStore();
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // When search is active, only show search results. Otherwise show regular users.
  const displayUsers = isSearchActive ? searchResults : users;
  
  useEffect(() => {
    if (!isSearchActive) {
      getUsers(currentPage, itemsPerPage);
    }
  }, [getUsers, currentPage, itemsPerPage, isSearchActive]);
  
  // Handle search with debounce
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
  }, [query]);
  
  // Log search results whenever they change
  useEffect(() => {
    console.log("Current search results:", searchResults);
  }, [searchResults]);
  
  const handleSearch = async () => {
    if (query.trim()) {
      await searchUsers(query);
      console.log("Search results:", searchResults);
      // Activate search mode when we have results
      setIsSearchActive(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
    setIsSearchActive(false);
  };
  
  const handleDelete = async (publicId: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setIsDeleting(publicId);
        await deleteUser(publicId);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  // Format date function
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "d MMMM yyyy");
    } catch (error) {
      return dateString;
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
      <div className="mt-5">
        <div className="flex justify-between items-center mb-5">
          <p className="font-semibold text-lg">Users</p>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button 
              onClick={() => {
                if (isSearchActive) {
                  // If search is active, re-run search
                  if (query.trim()) {
                    searchUsers(query);
                  }
                } else {
                  // If not in search mode, refresh users list
                  getUsers(currentPage, itemsPerPage);
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
                  placeholder="Search users by name, email or company..."
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
          {(loading && !isDeleting) && <Loading isVisible={true} />}
          {error && <p className="text-red-500">{error}</p>}
          
          {isSearchActive && searchResults && (
            <p className="text-sm text-gray-500">
              Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>First Name</TableHeader>
              <TableHeader>Last Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>Date Joined</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {displayUsers && displayUsers.length > 0 ? (
              displayUsers.map((user: UserData) => (
                <TableRow link={`/dashboard/users/details?userId=${user.publicId}`}
                  key={user.publicId}
                  className={user.isSuspended ? "bg-red-50" : ""}
                >
                  <TableCell>
                    {user.firstname || "-"}
                  </TableCell>
                  <TableCell>{user.lastname || "-"}</TableCell>
                  <TableCell className={user.isSuspended ? "text-gray-500" : ""}>
                    {user.email || "-"}
                  </TableCell>
                  <TableCell>{user.companyname || "-"}</TableCell>
                  <TableCell>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    {user.isSuspended ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle size={14} className="mr-1" />
                        <span className="text-sm font-medium">Suspended</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-green-600">Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Link href={`/dashboard/users/details?userId=${user.publicId}`}>
                        <Pen size={16} className="cursor-pointer" />
                      </Link>
                      {/* Uncomment to enable delete functionality
                      <button
                        disabled={isDeleting === user.publicId}
                        onClick={() => handleDelete(user.publicId)}
                        className="flex items-center"
                      >
                        {isDeleting === user.publicId ? (
                          <span className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"/>
                        ) : (
                          <Trash2
                            size={16}
                            className="text-red-600 cursor-pointer"
                          />
                        )}
                      </button>
                      */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell  className="text-center py-4">
                  {loading ? "Loading users..." : 
                   searching ? "Searching..." : 
                   isSearchActive ? "No matching users found" : "No users found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Only show pagination when not in search mode */}
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
    </div>
  );
}
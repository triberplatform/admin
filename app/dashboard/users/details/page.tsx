'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/app/components/BreadCrumb";
import CircularProgress from "@/app/components/CircularProgress";
import Header from "@/app/components/Header";
import { InfoGrid } from "@/app/components/infoGrid";
import { StatusBadge } from "@/app/components/StatusBadge";
import { StatusBadge2 } from "@/app/components/StatusBadge2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/Table";
import { Briefcase, User, ImageOff } from "lucide-react";
import Image from "next/image";
import EditUserModal from "@/app/components/Forms/EditUser";
import EditUserSuccessModal from "@/app/components/Modals/EditUserSuccess";
import SuspendUserModal from "@/app/components/Forms/SuspendUser";
import SuspendUserSuccessModal from "@/app/components/Modals/SuspendUser";
import SuspendUserFailureModal from "@/app/components/Modals/SuspendUserFailure";
import EditUserFailureModal from "@/app/components/Modals/EditUserFailure";
import UnsuspendUserModal from "@/app/components/Modals/UnsuspendUser";
import UnsuspendUserSuccessModal from "@/app/components/Modals/UnsuspendUserSuccess";
import UnsuspendUserFailureModal from "@/app/components/Modals/UnsuspendUserFailure";
import { useUserStore } from "@/app/store/useUserStore";
import { Business } from "@/app/types/response";
import Loading from "@/app/loading";

// Define types for our data structures
interface InfoGridItem {
  label: string;
  value: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
}

const UserPage: React.FC = () => {
  // Get user ID from URL search params
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  // Add a state to track if initial data fetching has occurred
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  // Get user data and actions from store
  const { getUsersById, suspendUser, unsuspendUser, userDetails, businessDetails, loading, error } = useUserStore();

  // State for managing modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState<boolean>(false);
  const [isEditFailureModalOpen, setIsEditFailureModalOpen] = useState<boolean>(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState<boolean>(false);
  const [isSuspendSuccessModalOpen, setIsSuspendSuccessModalOpen] = useState<boolean>(false);
  const [isSuspendFailureModalOpen, setIsSuspendFailureModalOpen] = useState<boolean>(false);
  const [isUnsuspendModalOpen, setIsUnsuspendModalOpen] = useState<boolean>(false);
  const [isUnsuspendSuccessModalOpen, setIsUnsuspendSuccessModalOpen] = useState<boolean>(false);
  const [isUnsuspendFailureModalOpen, setIsUnsuspendFailureModalOpen] = useState<boolean>(false);

  // Initial user data (will be replaced with real data)
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
  });

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      getUsersById(userId)
        .finally(() => {
          // Mark that we've attempted to fetch data
          setHasAttemptedFetch(true);
        });
    }
  }, [userId, getUsersById]);

  // Update local state when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setUserData({
        firstName: userDetails.firstname,
        lastName: userDetails.lastname,
        phoneNumber: "", // No phone number in the API response, could add if available
        location: userDetails.investorProfile?.location || "",
      });
    }
  }, [userDetails]);

  // Create info grid items based on user details
  const userInfoItems: InfoGridItem[] = userDetails ? [
    { label: "First Name", value: userDetails.firstname },
    { label: "Last Name", value: userDetails.lastname },
    { label: "Email", value: userDetails.email },
    { label: "Company Name", value: userDetails.companyname },
    { label: "Location", value: userDetails.investorProfile?.location || "N/A" },
    { label: "Date Joined", value: new Date(userDetails.createdAt).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: "Status", value: userDetails.isSuspended ? "Suspended" : "Active" }
  ] : [];

  // Handle user update
  const handleUpdateUser = (updatedData: UserData): void => {
    // In a real app, you would make an API call here
    // Simulate a success/failure scenario (for demo purposes)
    if (Math.random() > 0.3) { // 70% success rate
      setUserData(updatedData);
      setIsEditSuccessModalOpen(true);
    } else {
      setIsEditFailureModalOpen(true);
    }
  };

  // Handle user suspension
  const handleSuspendUser = (): void => {
    if (userId) {
      // Call the suspendUser function from the store
      suspendUser(userId)
        .then(() => {
          setIsSuspendSuccessModalOpen(true);
        })
        .catch(() => {
          setIsSuspendFailureModalOpen(true);
        });
    }
  };

  // Handle user unsuspension
  const handleUnsuspendUser = (): void => {
    if (userId) {
      // Call the unsuspendUser function from the store
      unsuspendUser(userId)
        .then(() => {
          setIsUnsuspendSuccessModalOpen(true);
        })
        .catch(() => {
          setIsUnsuspendFailureModalOpen(true);
        });
    }
  };

  // Handle retry for edit user
  const handleRetryEdit = (): void => {
    setIsEditFailureModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Handle retry for suspend user
  const handleRetrySuspend = (): void => {
    setIsSuspendFailureModalOpen(false);
    setIsSuspendModalOpen(true);
  };

  // Handle retry for unsuspend user
  const handleRetryUnsuspend = (): void => {
    setIsUnsuspendFailureModalOpen(false);
    setIsUnsuspendModalOpen(true);
  };

  // Render logo component
  const BusinessLogo = ({ logoUrl, businessName }: { logoUrl?: string, businessName: string }) => {
    const [imageError, setImageError] = useState(false);

    if (!logoUrl || imageError) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-md">
          <ImageOff size={20} className="text-gray-400" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 relative rounded-md overflow-hidden border border-gray-200">
        <img
          src={logoUrl}
          alt={`${businessName} logo`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  // Always show loading indicator when loading is true
  if (loading) {
    return <Loading isVisible={loading}/>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="px-6 ml-[20%] flex justify-center items-center h-screen">Error: {error}</div>;
  }

  // Only show "User not found" after we've attempted to fetch data AND there are no user details
  if (hasAttemptedFetch && !userDetails) {
    return <div className="px-6 ml-[20%] flex justify-center items-center h-screen">User not found</div>;
  }

  // During initial load when we haven't fetched data yet, show loading
  if (!hasAttemptedFetch) {
    return <Loading isVisible={true}/>;
  }

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />
      <div className="flex mt-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-full">
            <Image
              src="/icon.svg"
              alt="User"
              width={62}
              height={62}
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium">
                {userData.firstName} {userData.lastName}
              </p>
              {userDetails?.isSuspended && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Suspended
                </span>
              )}
            </div>
            <p className="text-mainGray text-sm">{userData.location || "N/A"}</p>
          </div>
        </div>
        <div className="gap-3 flex items-center text-xs">
          <button
            className="border px-4 py-2 border-black rounded"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
          {userDetails?.isSuspended ? (
            <button
              className="text-white px-4 py-2 bg-green-500 rounded"
              onClick={() => setIsUnsuspendModalOpen(true)}
            >
              Unsuspend User
            </button>
          ) : (
            <button
              className="text-white px-4 py-2 bg-mainPink rounded"
              onClick={() => setIsSuspendModalOpen(true)}
            >
              Suspend User
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-1">
          <User size={15} /> Personal Information
        </p>
        <InfoGrid items={userInfoItems} />
      </div>
      
      <div className="mt-10">
        <p className="font-semibold flex gap-1 items-center mb-5">
          <Briefcase size={15}/> Businesses
        </p>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>Logo</TableHeader>
              <TableHeader>Business Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Industry</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Fundability Score</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {businessDetails && businessDetails.length > 0 ? (
              businessDetails.map((business: Business) => (
                <TableRow key={business.publicId} link={`/dashboard/users/details/business-details?id=${business.publicId}`}>
                  <TableCell>
                    <BusinessLogo 
                      logoUrl={business.businessLogoUrl} 
                      businessName={business.businessName}
                    />
                  </TableCell>
                  <TableCell>{business.businessName}</TableCell>
                  <TableCell>{business.businessStage}</TableCell>
                  <TableCell>{business.industry}</TableCell>
                  <TableCell>{business.businessEmail}</TableCell>
                  <TableCell>
                    <CircularProgress 
                      percentage={business.fundabilityTestDetails?.score || 0} 
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={business.businessStatus} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center py-4">
                  <p className="text-2xl py-6 text-mainGreen font-semibold"> No Businesses created by this user</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* <div className="my-10">
        <p className="font-semibold flex gap-1 items-center mb-5">
          <Briefcase size={15}/> Proposals Sent
        </p>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>Date</TableHeader>
              <TableHeader>Business Name</TableHeader>
              <TableHeader>Industry</TableHeader>
              <TableHeader>Proposed Amount</TableHeader>
              <TableHeader>Documents</TableHeader>
              <TableHeader>Fundability Score</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
    
            <TableRow>
              <TableCell>11 Mar 2025</TableCell>
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>200 M</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge2 status="Accepted" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>11 Mar 2025</TableCell>
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>200 M</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge2 status="Pending Response" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>11 Mar 2025</TableCell>
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>200 M</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge2 status="Rejected" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div> */}

      {/* Modal Components */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onUpdate={handleUpdateUser}
      />
      
      <EditUserSuccessModal
        title="Edit User"
        isOpen={isEditSuccessModalOpen}
        text="User information updated successfully."
        onClose={() => setIsEditSuccessModalOpen(false)}
      />
      
      <EditUserFailureModal
        isOpen={isEditFailureModalOpen}
        onClose={() => setIsEditFailureModalOpen(false)}
        onRetry={handleRetryEdit}
      />
      
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onSuspend={handleSuspendUser}
        userName={`${userData.firstName} ${userData.lastName}`}
      />
      
      <SuspendUserSuccessModal
        isOpen={isSuspendSuccessModalOpen}
        onClose={() => setIsSuspendSuccessModalOpen(false)}
        duration="indefinite" // Since we no longer collect duration
      />
      
      <SuspendUserFailureModal
        isOpen={isSuspendFailureModalOpen}
        onClose={() => setIsSuspendFailureModalOpen(false)}
        onRetry={handleRetrySuspend}
      />

      {/* Unsuspend user modals */}
      <UnsuspendUserModal
        isOpen={isUnsuspendModalOpen}
        onClose={() => setIsUnsuspendModalOpen(false)}
        onUnsuspend={handleUnsuspendUser}
        userName={`${userData.firstName} ${userData.lastName}`}
      />
      
      <UnsuspendUserSuccessModal
        isOpen={isUnsuspendSuccessModalOpen}
        onClose={() => setIsUnsuspendSuccessModalOpen(false)}
      />
      
      <UnsuspendUserFailureModal
        isOpen={isUnsuspendFailureModalOpen}
        onClose={() => setIsUnsuspendFailureModalOpen(false)}
        onRetry={handleRetryUnsuspend}
      />
    </div>
  );
};

export default UserPage;
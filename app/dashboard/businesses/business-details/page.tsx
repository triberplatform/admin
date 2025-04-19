"use client";
import Breadcrumb from "@/app/components/BreadCrumb";

import CircularProgress2 from "@/app/components/CircularProgress2";
import EditBusinessModal from "@/app/components/Forms/EditBusiness";
import UpdateFundabilityScoreModal from "@/app/components/Forms/UpdateFundability";
import Header from "@/app/components/Header";
import { InfoGrid, InfoGridItem } from "@/app/components/infoGrid";
import EditUserFailureModal from "@/app/components/Modals/EditUserFailure";
import EditUserSuccessModal from "@/app/components/Modals/EditUserSuccess";

import SuspendUserFailureModal from "@/app/components/Modals/SuspendUserFailure";
import UpdateScoreSuccessModal from "@/app/components/Modals/UpdateFundabilityModal";
import VerifyBusinessModal from "@/app/components/VerifyModal";
import VerifyBusinessSuccessModal from "@/app/components/Modals/VerifyModalSuccess";
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
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBusinessStore } from "@/app/store/useBusinessStore";
import { useFundabilityStore } from "@/app/store/useFundabilityStore";
import { format } from "date-fns";
import { CheckCircle, BadgeCheck } from "lucide-react";
import Loading from "@/app/loading";

const imageLoader = ({src}:any) => {
  return `${src}`;
}

// Type definition for business form data
interface BusinessFormData {
  businessName: string;
  location: string;
  industry: string;
  established: string;
  ownershipType: string;
}

interface UpdateScoreData {
  newScore: string | number;
  reason: string;
}

interface ScoreHistoryItem {
  timestamp: string;
  score: number;
  reason: string;
  updatedBy: string;
}

export default function Page(): React.ReactElement {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") || "";
  
  // Add a state to track if initial data fetching has occurred
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);
  
  const {
    businessDetails,
    fundabilityDetails,
    dealRoomDetails,
    loading,
    error,
    getBusinessById,
    verifyBusiness,
    verifying
  } = useBusinessStore();

  // Get the updateScore function from the fundability store
  const { updateScore, loading: scoreUpdateLoading, error: scoreUpdateError } = useFundabilityStore();

  // State variables
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState<boolean>(false);
  const [isEditFailureModalOpen, setIsEditFailureModalOpen] = useState<boolean>(false);
  const [isSuspendFailureModalOpen, setIsSuspendFailureModalOpen] = useState<boolean>(false);
  const [isEditFundabilityModalOpen, setIsEditFundabilityModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isVerifySuccessModalOpen, setIsVerifySuccessModalOpen] = useState<boolean>(false);
  const [updateReason, setUpdateReason] = useState<string>("");
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
  const [updatedScore, setUpdatedScore] = useState<number>(0);
  
  // Initialize business form data for the edit modal
  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({
    businessName: "",
    location: "",
    industry: "",
    established: "",
    ownershipType: ""
  });

  // Load business data when component mounts or businessId changes
  useEffect(() => {
    if (businessId) {
      getBusinessById(businessId)
        .finally(() => {
          // Mark that we've attempted to fetch data regardless of outcome
          setHasAttemptedFetch(true);
        });
    }
  }, [businessId, getBusinessById]);

  // Update local form data when business details are fetched
  useEffect(() => {
    if (businessDetails) {
      setBusinessFormData({
        businessName: businessDetails.businessName,
        location: businessDetails.location,
        industry: businessDetails.industry,
        established: businessDetails.yearEstablished?.toString() || "",
        ownershipType: businessDetails.businessLegalEntity || ""
      });
      
      // Initialize score history if fundabilityDetails exists
      if (fundabilityDetails) {
        setScoreHistory([
          {
            timestamp: fundabilityDetails.updatedAt || new Date().toISOString(),
            score: fundabilityDetails.score || 0,
            reason: "Initial assessment based on financial documents and business model.",
            updatedBy: "System",
          },
        ]);
      }
    }
  }, [businessDetails, fundabilityDetails]);

  const handleRetryEdit = (): void => {
    setIsEditFailureModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleRetrySuspend = (): void => {
    setIsSuspendFailureModalOpen(false);
    setIsEditFundabilityModalOpen(true);
  };

  const handleVerifyBusiness = async (): Promise<void> => {
    if (!businessDetails || !businessId) return;
    
    try {
      // Call the verify business function
      const result = await verifyBusiness(businessId);
      
      // Close the verify modal and show success modal if successful
      if (result.success) {
        setIsVerifyModalOpen(false);
        setIsVerifySuccessModalOpen(true);
      } else {
        console.error('Verification failed:', result.message);
        // You could show an error modal here
      }
    } catch (error) {
      console.error('Error verifying business:', error);
      // You could show an error modal here
    }
  };

  const handleUpdateScore = async (data: UpdateScoreData): Promise<void> => {
    const numericScore = Number(data.newScore);
    
    // Update reason for display in success modal
    setUpdateReason(data.reason);
    setUpdatedScore(numericScore);
    
    // Close the update modal
    setIsEditFundabilityModalOpen(false);
    
    try {
      // Call the API to update the score if fundabilityDetails exists
      if (fundabilityDetails && fundabilityDetails.publicId) {
        await updateScore(numericScore, fundabilityDetails.publicId);
        
        // Add to history for UI purposes
        setScoreHistory([
          {
            timestamp: new Date().toISOString(),
            score: numericScore,
            reason: data.reason,
            updatedBy: "Current User", // This would typically come from your auth system
          },
          ...scoreHistory,
        ]);
        
        // Show the success modal
        setIsSuccessModalOpen(true);
        
        // Refresh business details to get updated fundability score
        if (businessId) {
          getBusinessById(businessId);
        }
      } else {
        console.error("No fundability details or publicId available");
        setIsSuspendFailureModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating fundability score:", error);
      setIsSuspendFailureModalOpen(true);
    }
  };

  const handleUpdate = (updatedData: BusinessFormData): void => {
    setBusinessFormData(updatedData);
    setIsEditSuccessModalOpen(true);
    console.log("Business updated:", updatedData);

    // Here you would typically make an API call to update the business data
  };

  // Format the date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Generate info grid items from business details
  const generateInfoGridItems = (): InfoGridItem[] => {
    if (!businessDetails) return [];
    
    return [
      { label: "Owner", value: businessDetails.businessName }, // Using business name as owner for demo
      { label: "Email", value: businessDetails.businessEmail },
      { label: "Phone Number", value: businessDetails.businessPhone },
      { label: "Location", value: businessDetails.location },
      { label: "Industry", value: businessDetails.industry },
      { label: "Established", value: `${businessDetails.yearEstablished}` },
      { label: "Ownership Type", value: businessDetails.businessLegalEntity.replace(/_/g, " ") },
      {
        label: "Verification Status",
        value: (
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full ${businessDetails.businessVerificationStatus ? "bg-green-500" : "bg-red-500"} mr-2`}></span>
            {businessDetails.businessVerificationStatus ? "Verified" : "Not Verified"}
          </div>
        ),
      },
    ];
  };
  
  // Always show loading indicator when loading is true
  if (loading) {
    return <Loading isVisible={loading}/>;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Only show "No business details found" after we've attempted to fetch data AND there are no business details
  if (hasAttemptedFetch && !businessDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No business details found.</p>
      </div>
    );
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
            {businessDetails?.businessLogoUrl ? (
              <Image
                src={businessDetails?.businessLogoUrl}
                alt={businessDetails?.businessName}
                loader={imageLoader}
                width={62}
                height={62}
                className="object-cover rounded-full"
              />
            ) : (
              <Image
                src="/main-business.svg"
                alt="Business"
                width={62}
                height={62}
                className="object-cover"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium">{businessDetails?.businessName}</p>
              {businessDetails?.businessVerificationStatus && (
                <BadgeCheck size={20} className="text-green-500" />
              )}
            </div>
            <p className="text-mainGray text-sm mt-1">
              <StatusBadge status={businessDetails?.businessStatus || "test"} />
            </p>
          </div>
        </div>
        <div className="gap-3 flex items-center text-xs">
          {!businessDetails?.businessVerificationStatus && (
            <button
              className="border px-4 py-2 border-green-500 text-green-500 rounded flex items-center gap-1 hover:bg-green-50"
              onClick={() => setIsVerifyModalOpen(true)}
              disabled={verifying}
            >
              <CheckCircle size={16} />
              {verifying ? "Verifying..." : "Verify Business"}
            </button>
          )}
          <button
            className="border px-4 py-2 border-black rounded"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>
      <p className="text-mainGray text-sm mt-5">
        {businessDetails?.description || "No description available."}
      </p>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Business"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Business
        </p>
        <InfoGrid items={generateInfoGridItems()} />
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/fundability.svg"
            alt="Fundability"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Fundability
        </p>
        <div className="flex justify-between">
          <CircularProgress2 
            size={90} 
            textSize="15px" 
            percentage={fundabilityDetails?.score || 0} 
          />
          <div className="flex gap-2 text-xs">
            <button>
              <Link 
                href={`/dashboard/businesses/business-details/fundability-details?id=${businessId}`} 
                className="border-mainGray border rounded py-2 px-4"
              >
                View Fundability Details
              </Link>
            </button>
            <button 
              onClick={() => setIsEditFundabilityModalOpen(true)}
              disabled={scoreUpdateLoading}
            >
              <span className="border-mainGray border rounded py-2 px-4">
                {scoreUpdateLoading ? "Updating..." : "Update Score"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center flex gap-2">
          <Image
            src="/valuation.svg"
            alt="Valuation"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Valuation
        </p>
        <p className="text-mainGray text-sm mb-5">
          Prepared {formatDate(businessDetails?.updatedAt || "today")}
        </p>
      </div>
      <div className="px-5 py-5 border border-gray-200 rounded-xl">
        <p className="text-mainGreen font-medium mb-4">Valuation Summary</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-gray-600 text-sm mb-1">Valuation Range</p>
            <p className="font-medium text-xs">
              {dealRoomDetails?.tentativeSellingPrice ? 
                `₦ ${(dealRoomDetails.tentativeSellingPrice * 0.8).toLocaleString()} - ₦ ${(dealRoomDetails.tentativeSellingPrice * 1.2).toLocaleString()}` : 
                "Not Available"}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">
              Current Fundability Score
            </p>
            <p className="font-medium text-xs">{fundabilityDetails?.score || 0}%</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Investment potential</p>
            <p className="font-medium text-xs">
              {fundabilityDetails?.score && fundabilityDetails.score > 70 ? "High Growth Potential" : 
               fundabilityDetails?.score && fundabilityDetails.score > 50 ? "Moderate Growth Potential" : 
               "Low Growth Potential"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-mainGreen font-medium mb-4">
            Key Valuation Metrics
          </p>

      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
            <div>
              <p className="text-gray-600 text-sm mb-1">Annual Revenue</p>
              <p className="font-medium text-xs">
                {dealRoomDetails?.reportedYearlySales ? 
                  `₦ ${dealRoomDetails.reportedYearlySales.toLocaleString()}` : 
                  fundabilityDetails?.averageAnnualRevenue ? 
                  `₦ ${fundabilityDetails.averageAnnualRevenue.toLocaleString()}` : 
                  "Not Available"}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">EBITDA</p>
              <p className="font-medium text-xs">
                {dealRoomDetails?.averageMonthlySales ? 
                  `₦ ${(dealRoomDetails.averageMonthlySales * 12 * (dealRoomDetails.profitMarginPercentage / 100)).toLocaleString()}` : 
                  "Not Available"}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Net Profit Margin</p>
              <p className="font-medium text-xs">
                {dealRoomDetails?.profitMarginPercentage ? 
                  `${dealRoomDetails.profitMarginPercentage}%` : 
                  "Not Available"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Growth Rate</p>
              <p className="font-medium text-xs">
                {fundabilityDetails?.revenueGrowthRate ? 
                  `${fundabilityDetails.revenueGrowthRate}%` : 
                  "Not Available"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="my-10">
          <p className="font-semibold flex gap-1 items-center mb-5">
            <Image
              src="/business.svg"
              alt="Proposals"
              width={20}
              height={20}
              className="object-cover"
            />{" "}
            Proposals Sent
          </p>
          {dealRoomDetails?.proposalDetails && dealRoomDetails.proposalDetails.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Investor</TableHeader>
                  <TableHeader>Industry</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Proposed Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {dealRoomDetails.proposalDetails.map((proposal: any, index: number) => (
                  <TableRow key={index} link={`/dashboard/businesses/business-details/proposals?id=${proposal.id}`}>
                    <TableCell>{formatDate(proposal.createdAt || '')}</TableCell>
                    <TableCell>{proposal.investorName || 'Unknown'}</TableCell>
                    <TableCell>{proposal.industry || 'N/A'}</TableCell>
                    <TableCell>{proposal.email || 'N/A'}</TableCell>
                    <TableCell>{proposal.amount ? `₦${proposal.amount.toLocaleString()}` : 'N/A'}</TableCell>
                    <TableCell>
                      <StatusBadge2 status={proposal.status || 'Pending'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded">
              <p className="text-gray-500">No proposals available</p>
            </div>
          )}
        </div>
      </div>
      <EditBusinessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        businessData={businessFormData}
        onUpdate={handleUpdate}
      />
      <UpdateFundabilityScoreModal
        isOpen={isEditFundabilityModalOpen}
        onClose={() => setIsEditFundabilityModalOpen(false)}
        currentScore={fundabilityDetails?.score || 0}
        onUpdateScore={handleUpdateScore}
      />
      <EditUserSuccessModal
        title="Edit Business"
        isOpen={isEditSuccessModalOpen}
        text="Business information updated successfully."
        onClose={() => setIsEditSuccessModalOpen(false)}
      />
      <EditUserFailureModal
        isOpen={isEditFailureModalOpen}
        onClose={() => setIsEditFailureModalOpen(false)}
        onRetry={handleRetryEdit}
      />
      <UpdateScoreSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        newScore={updatedScore}
        reason={updateReason}
      />
      <SuspendUserFailureModal
        isOpen={isSuspendFailureModalOpen}
        onClose={() => setIsSuspendFailureModalOpen(false)}
        onRetry={handleRetrySuspend}
      />
      
      {/* New Verify Business Modal */}
      <VerifyBusinessModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onConfirm={handleVerifyBusiness}
        businessName={businessDetails?.businessName || "test"}
        isVerifying={verifying}
      />
      
      {/* New Verify Success Modal */}
      <VerifyBusinessSuccessModal
        isOpen={isVerifySuccessModalOpen}
        onClose={() => setIsVerifySuccessModalOpen(false)}
        businessName={businessDetails?.businessName || "test"}
      />
    </div>
  );
}
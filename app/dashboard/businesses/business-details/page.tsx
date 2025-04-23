"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBusinessStore } from '@/app/store/useBusinessStore';
import { useFundabilityStore } from '@/app/store/useFundabilityStore';
import Breadcrumb from "@/app/components/BreadCrumb";
import CircularProgress2 from "@/app/components/CircularProgress2";
import DocumentCard from "@/app/components/DocumentCard";
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
import { format } from "date-fns";
import { CheckCircle, BadgeCheck, File } from "lucide-react";
import Loading from "@/app/loading";
import { ProposalSentBusiness } from "@/app/types/response";
import { StatusBadge3 } from '@/app/components/StatusBadge3';
import { StatusBadge4 } from '@/app/components/StatusBadge4';

const imageLoader = ({src}:any) => {
  return `${src}`;
}

// Type definition for business form data with optional fields
interface BusinessData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  location: string;
  industry: string;
  yearEstablished: string | number;
  businessLegalEntity: string;
  description: string;
  interestedIn?: string;  // Optional fields
  numOfEmployees?: string;
  assets?: string;
  reportedSales?: string;
  businessStage?: string;
  businessStatus?: string;
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

// Type definition for document
interface Document {
  id: string;
  title: string;
  fileType?: string;
  fileSize: string;
  downloadUrl: string;
  date?: string;
}

// Props type for DocumentPreviewModal
interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

// Document Preview Modal Component
const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  document 
}) => {
  if (!isOpen || !document) return null;

  // Determine content type based on fileType
  const isImage = document.fileType === 'JPG' || document.fileType === 'PNG';

  // Handle file download
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Use window.document to explicitly access the DOM Document interface
    const link = window.document.createElement('a');
    link.href = document.downloadUrl;
    link.download = document.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{document.title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close preview"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {isImage ? (
            // Render image
            <div className="flex justify-center">
              <Image
                src={document.downloadUrl} 
                loader={imageLoader}
                width={1000}
                height={1000}
                alt={document.title} 
                className="max-w-full max-h-[70vh] object-contain" 
              />
            </div>
          ) : (
            // Render iframe for PDF
            <iframe 
              src={document.downloadUrl} 
              className="w-full h-[70vh]" 
              title={document.title}
            />
          )}
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {document.fileType} · {document.fileSize} · {document.date ? format(new Date(document.date), "dd MMM yyyy") : "No date"}
          </div>
          <Link 
            href={document.downloadUrl}
            passHref
            legacyBehavior
          >
            <a
              download={document.title}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownload}
            >
              Download
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Page(): React.ReactElement {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") || "";
  
  // Add a state to track if initial data fetching has occurred
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);
  
  // Use a ref to track if we've already fetched proposals for this business ID
  const proposalsFetchedRef = useRef<string | null>(null);
  
  const {
    businessDetails,
    fundabilityDetails,
    dealRoomDetails,
    proposals,
    proposalsRecieved,
    loading,
    loadingProposals,
    error,
    getBusinessById,
    getProposalsSent,
    getProposalsRecieved,
    verifyBusiness,
    verifying,
    editBusiness,
    editing
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
  
  // Document preview states
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  
  // Initialize business form data for the edit modal with proper typing for optional fields
  const [businessFormData, setBusinessFormData] = useState<BusinessData>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    location: "",
    industry: "",
    yearEstablished: "",
    businessLegalEntity: "",
    description: "",
    // Optional fields are not included by default
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

  // Load proposals data when business details are loaded
  useEffect(() => {
    // Only fetch if businessId exists and we haven't fetched for this ID yet
    if (businessId && proposalsFetchedRef.current !== businessId) {
      // Set the ref immediately to prevent multiple fetches
      proposalsFetchedRef.current = businessId;
      
      // Get proposals sent
      getProposalsSent(businessId);
      
      // Get proposals received
      getProposalsRecieved(businessId);
    }
  }, [businessId, getProposalsSent, getProposalsRecieved]);

  // Update local form data when business details are fetched
  useEffect(() => {
    if (businessDetails) {
      // Create a base object with required fields
      const baseFormData: BusinessData = {
        businessName: businessDetails.businessName || "",
        businessEmail: businessDetails.businessEmail || "",
        businessPhone: businessDetails.businessPhone || "",
        location: businessDetails.location || "",
        industry: businessDetails.industry || "",
        yearEstablished: businessDetails.yearEstablished?.toString() || "",
        businessLegalEntity: businessDetails.businessLegalEntity || "",
        description: businessDetails.description || "",
      };
      
      // Add optional fields only if they exist
      if (businessDetails.interestedIn) baseFormData.interestedIn = businessDetails.interestedIn;
      if (businessDetails.numOfEmployees) baseFormData.numOfEmployees = businessDetails.numOfEmployees;
      if (businessDetails.assets) baseFormData.assets = businessDetails.assets;
      if (businessDetails.reportedSales) baseFormData.reportedSales = businessDetails.reportedSales;
      if (businessDetails.businessStage) baseFormData.businessStage = businessDetails.businessStage;
      if (businessDetails.businessStatus) baseFormData.businessStatus = businessDetails.businessStatus;
      
      setBusinessFormData(baseFormData);
      
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

  // Handle updating a business with proper typing
  const handleUpdate = async (updatedData: BusinessData): Promise<void> => {
    try {
      // Create payload with only necessary fields
      const payload: any = {
        businessName: updatedData.businessName,
        businessEmail: updatedData.businessEmail,
        businessPhone: updatedData.businessPhone,
        location: updatedData.location,
        industry: updatedData.industry,
        businessLegalEntity: updatedData.businessLegalEntity,
        description: updatedData.description,
        yearEstablished: Number(updatedData.yearEstablished),
      };
      
      // Only add optional fields if they are defined
      if (updatedData.interestedIn) payload.interestedIn = updatedData.interestedIn;
      if (updatedData.numOfEmployees) payload.numOfEmployees = updatedData.numOfEmployees;
      if (updatedData.assets) payload.assets = updatedData.assets;
      if (updatedData.reportedSales) payload.reportedSales = updatedData.reportedSales;
      if (updatedData.businessStage) payload.businessStage = updatedData.businessStage;
      if (updatedData.businessStatus) payload.businessStatus = updatedData.businessStatus;
      
      // Log the payload for debugging
      console.log("Update business payload:", payload);
      
      // Update the business using the store
      const result = await editBusiness(businessId, payload);
      
      console.log("Update business result:", result);

      if (result.success) {
        // Update local state and show success modal
        setBusinessFormData(updatedData);
        setIsEditModalOpen(false);
        setIsEditSuccessModalOpen(true);
        
        // Refresh business details
        getBusinessById(businessId);
      } else {
        // Show failure modal
        setIsEditModalOpen(false);
        setIsEditFailureModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating business:", error);
      setIsEditModalOpen(false);
      setIsEditFailureModalOpen(true);
    }
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

  // Handle document click for preview
  const handleDocumentClick = (doc: Document): void => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };
  
  // Close document preview
  const closePreview = (): void => {
    setIsPreviewOpen(false);
  };

  // Process business photos as documents
  const mapBusinessPhotosToDocuments = (): Document[] => {
    if (!dealRoomDetails?.businessPhotos || dealRoomDetails.businessPhotos.length === 0) {
      return [];
    }
    
    return dealRoomDetails.businessPhotos.map((photoUrl, index) => {
      // Determine file type from URL or default to JPG
      const fileType = photoUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPG';
      
      return {
        id: `photo-${index}`,
        title: `Business Photo ${index + 1}`,
        fileType,
        fileSize: "2.5 MB", // Placeholder size
        downloadUrl: photoUrl,
        date: dealRoomDetails.updatedAt
      };
    });
  };

  // Process business documents as documents
  const mapBusinessDocumentsToDocuments = (): Document[] => {
    if (!dealRoomDetails?.businessDocuments || dealRoomDetails.businessDocuments.length === 0) {
      return [];
    }
    
    return dealRoomDetails.businessDocuments.map((docUrl, index) => {
      // Determine file type from URL or default to PDF
      const fileType = docUrl.toLowerCase().endsWith('.png') ? 'PNG' : 
                      docUrl.toLowerCase().endsWith('.jpg') || docUrl.toLowerCase().endsWith('.jpeg') ? 'JPG' : 'PDF';
      
      return {
        id: `doc-${index}`,
        title: `Business Document ${index + 1}`,
        fileType,
        fileSize: "3.2 MB", // Placeholder size
        downloadUrl: docUrl,
        date: dealRoomDetails.updatedAt
      };
    });
  };

  // Process proof of business as document
  const mapProofOfBusinessToDocument = (): Document[] => {
    if (!dealRoomDetails?.proofOfBusiness) {
      return [];
    }
    
    // Determine file type from URL or default to PDF
    const fileType = dealRoomDetails.proofOfBusiness.toLowerCase().endsWith('.png') ? 'PNG' : 
                    dealRoomDetails.proofOfBusiness.toLowerCase().endsWith('.jpg') || 
                    dealRoomDetails.proofOfBusiness.toLowerCase().endsWith('.jpeg') ? 'JPG' : 'PDF';
    
    return [{
      id: 'proof-of-business',
      title: 'Proof of Business',
      fileType,
      fileSize: "4.1 MB", // Placeholder size
      downloadUrl: dealRoomDetails.proofOfBusiness,
      date: dealRoomDetails.updatedAt
    }];
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

  // Combine all documents for the new documents section
  const businessPhotos = mapBusinessPhotosToDocuments();
  const businessDocuments = mapBusinessDocumentsToDocuments();
  const proofOfBusiness = mapProofOfBusinessToDocument();
  
  // Render the proposals table or a message if no proposals
  const renderProposalsTable = () => {
    if (loadingProposals) {
      return (
        <div className="text-center py-8 border border-gray-200 rounded">
          <Loading isVisible={true} />
        </div>
      );
    }
    
    if (!proposals || proposals.length === 0) {
      return (
        <div className="text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500">No proposals available</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableHeader>Date</TableHeader>
            <TableHeader>Investor</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Selling Price</TableHeader>
            <TableHeader>Proposal</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {proposals.map((proposal: ProposalSentBusiness) => (
            <TableRow key={proposal.id} link={`/dashboard/businesses/business-details/proposals?id=${proposal.publicId}`}>
              <TableCell>{formatDate(proposal.createdAt)}</TableCell>
              <TableCell className="flex items-center gap-2">
                {proposal.investor?.companyLogoUrl ? (
                  <Image
                    src={proposal.investor.companyLogoUrl}
                    loader={imageLoader}
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                    alt={proposal.investor.companyName}
                  />
                ) : null}
                {proposal.investor?.companyName || 'Unknown'}
              </TableCell>
              <TableCell>{proposal.investor?.email || 'N/A'}</TableCell>
              <TableCell>{proposal.sellingPrice ? `₦${parseInt(proposal.sellingPrice).toLocaleString()}` : 'N/A'}</TableCell>
              <TableCell className="max-w-[200px] truncate">{proposal.proposal || 'N/A'}</TableCell>
              <TableCell><StatusBadge3 status={proposal.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Render the proposals received table or a message if no proposals
  const renderProposalsReceivedTable = () => {
    if (loadingProposals) {
      return (
        <div className="text-center py-8 border border-gray-200 rounded">
          <Loading isVisible={true} />
        </div>
      );
    }
    
    if (!proposalsRecieved || proposalsRecieved.length === 0) {
      return (
        <div className="text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500">No proposals received</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableHeader>Date</TableHeader>
            <TableHeader>Investor</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Buying Price</TableHeader>
            <TableHeader>Proposal</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {proposalsRecieved.map((proposal) => (
            <TableRow key={proposal.id} link={`/dashboard/businesses/business-details/proposals-received?id=${proposal.publicId}`}>
              <TableCell>{formatDate(proposal.createdAt)}</TableCell>
              <TableCell className="flex items-center gap-2">
                {proposal.investor?.companyLogoUrl ? (
                  <Image
                    src={proposal.investor.companyLogoUrl}
                    loader={imageLoader}
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                    alt={proposal.investor.companyName}
                  />
                ) : null}
                {proposal.investor?.companyName || 'Unknown'}
              </TableCell>
              <TableCell>{proposal.investor?.email || 'N/A'}</TableCell>
              <TableCell>{proposal.buyingPrice ? `₦${parseInt(proposal.buyingPrice).toLocaleString()}` : 'N/A'}</TableCell>
              <TableCell className="max-w-[200px] truncate">{proposal.proposal || 'N/A'}</TableCell>
              <TableCell><StatusBadge4 status={proposal.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
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
            disabled={editing}
          >
            {editing ? "Updating..." : "Edit"}
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

      {/* Add business documents section here */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <File size={20} />
          Business Documents
        </p>
        
        {/* Proof of Business Section */}
        {proofOfBusiness.length > 0 && (
          <div className="mb-8">
            <h3 className="text-mainGreen font-medium mb-4">Proof of Business</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proofOfBusiness.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => handleDocumentClick(doc)}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  role="button"
                  aria-label={`View ${doc.title}`}
                  tabIndex={0}
                >
                  <DocumentCard document={doc} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Business Documents Section */}
        {businessDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-mainGreen font-medium mb-4">Business Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => handleDocumentClick(doc)}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  role="button"
                  aria-label={`View ${doc.title}`}
                  tabIndex={0}
                >
                  <DocumentCard document={doc} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Business Photos Section */}
        {businessPhotos.length > 0 && (
          <div>
            <h3 className="text-mainGreen font-medium mb-4">Business Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessPhotos.map((doc) => (
               <div 
               key={doc.id} 
               onClick={() => handleDocumentClick(doc)}
               className="cursor-pointer hover:shadow-md transition-shadow duration-200"
               role="button"
               aria-label={`View ${doc.title}`}
               tabIndex={0}
             >
               <DocumentCard document={doc} />
             </div>
           ))}
         </div>
       </div>
     )}
     
     {/* Show message when no documents are available */}
     {proofOfBusiness.length === 0 && businessDocuments.length === 0 && businessPhotos.length === 0 && (
       <div className="text-center py-8 border border-gray-200 rounded">
         <p className="text-gray-500">No business documents available</p>
       </div>
     )}
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
   
   {/* Proposals Sent Section */}
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
     {renderProposalsTable()}
   </div>
   
   {/* Proposals Received Section */}
   <div className="my-10">
     <p className="font-semibold flex gap-1 items-center mb-5">
       <Image
         src="/business.svg"
         alt="Proposals"
         width={20}
         height={20}
         className="object-cover"
       />{" "}
       Proposals Received
     </p>
     {renderProposalsReceivedTable()}
   </div>
   
   {/* Edit Business Modal with fixed prop types */}
   <EditBusinessModal
     isOpen={isEditModalOpen}
     onClose={() => setIsEditModalOpen(false)}
     businessData={businessFormData}
     businessId={businessId}
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
   
   {/* Verify Business Modal */}
   <VerifyBusinessModal
     isOpen={isVerifyModalOpen}
     onClose={() => setIsVerifyModalOpen(false)}
     onConfirm={handleVerifyBusiness}
     businessName={businessDetails?.businessName || "test"}
     isVerifying={verifying}
   />
   
   {/* Verify Success Modal */}
   <VerifyBusinessSuccessModal
     isOpen={isVerifySuccessModalOpen}
     onClose={() => setIsVerifySuccessModalOpen(false)}
     businessName={businessDetails?.businessName || "test"}
   />

   {/* Document Preview Modal */}
   <DocumentPreviewModal 
     isOpen={isPreviewOpen} 
     onClose={closePreview} 
     document={previewDoc} 
   />
 </div>
);
}
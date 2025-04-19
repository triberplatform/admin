"use client";
import Breadcrumb from "@/app/components/BreadCrumb";
import CircularProgress2 from "@/app/components/CircularProgress2";
import DocumentCard from "@/app/components/DocumentCard";
import Header from "@/app/components/Header";
import { InfoGrid, InfoGridItem } from "@/app/components/infoGrid";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBusinessStore } from "@/app/store/useBusinessStore";
import { format } from "date-fns";
import { BusinessData, FundabilityTestDetail, FundabilityDocs } from "@/app/types/response";
import Loading from "@/app/loading";

// Type definitions
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

// Modal component for document preview
// Modal component for document preview
const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  document 
}) => {
  if (!isOpen || !document) return null;

  // Determine content type based on fileType
  const isImage = document.fileType === 'JPG' || document.fileType === 'PNG';
  const imageLoader = ({src}:any) => {
    return `${src}`;
  }

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

// Main FundabilityDetailsPage component
const FundabilityDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const businessId: string = searchParams.get("id") || "";
  
  const {
    businessDetails,
    fundabilityDetails,
    dealRoomDetails,
    loading,
    error,
    getBusinessById
  } = useBusinessStore();

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // Load business data when component mounts or businessId changes
  useEffect(() => {
    if (businessId) {
      getBusinessById(businessId);
      setDataFetched(true);
    }
  }, [businessId, getBusinessById]);

  const handleDocumentClick = (doc: Document): void => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };
  
  const closePreview = (): void => {
    setIsPreviewOpen(false);
  };

  // Format date string
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "EEEE, dd MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Map API data to documents
  const mapFundabilityDocsToDocuments = (): Document[] => {
    if (!fundabilityDetails?.docs) return [];
    
    const docs: Document[] = [];
    const fileEntries = Object.entries(fundabilityDetails.docs as FundabilityDocs);
    
    fileEntries.forEach(([key, url]) => {
      if (url) {
        // Determine file type from URL or default to PDF
        const fileType: string = url.toLowerCase().endsWith('.png') ? 'PNG' : 
                        url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg') ? 'JPG' : 'PDF';
        
        // Format document title (transform camelCase to Title Case)
        const title: string = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        
        docs.push({
          id: key,
          title,
          fileType,
          fileSize: "3.7 MB", // Placeholder size since API doesn't provide this
          downloadUrl: url,
          date: fundabilityDetails.updatedAt
        });
      }
    });
    
    return docs;
  };

  // Generate business data items
  const generateBusinessDataItems = (): InfoGridItem[] => {
    if (!businessDetails || !fundabilityDetails) return [];
    
    return [
      { label: "Business Name", value: businessDetails.businessName },
      { label: "Email", value: fundabilityDetails.companyEmail || businessDetails.businessEmail },
      { label: "Phone Number", value: fundabilityDetails.contactNumber || businessDetails.businessPhone },
      { label: "Business Owner", value: fundabilityDetails.legalName || businessDetails.businessName },
      { label: "Ownership Type", value: businessDetails.businessLegalEntity.replace(/_/g, " ") },
      { label: "Location", value: `${fundabilityDetails.city}, ${fundabilityDetails.country}` },
      { label: "Industry", value: fundabilityDetails.industry || businessDetails.industry },
      { label: "Address", value: fundabilityDetails.registeredAddress || "Not provided" },
      { label: "Established", value: formatDate(businessDetails.createdAt) },
    ];
  };

  // Generate financial data items
  const generateFinancialDataItems = (): InfoGridItem[] => {
    if (!dealRoomDetails || !fundabilityDetails) return [];
    
    return [
      { 
        label: "Average Monthly Sales", 
        value: dealRoomDetails.averageMonthlySales ? `₦ ${dealRoomDetails.averageMonthlySales.toLocaleString()}` : "Not provided" 
      },
      { 
        label: "Last Reported Yearly Sales", 
        value: dealRoomDetails.reportedYearlySales ? `₦ ${dealRoomDetails.reportedYearlySales.toLocaleString()}` : 
              fundabilityDetails.averageAnnualRevenue ? `₦ ${fundabilityDetails.averageAnnualRevenue.toLocaleString()}` : "Not provided" 
      },
      { 
        label: "EBITDA/Operating Profit Margin Percentage", 
        value: dealRoomDetails.profitMarginPercentage ? `${dealRoomDetails.profitMarginPercentage}%` : "Not provided" 
      },
      { 
        label: "Total Asset Valuation", 
        value: dealRoomDetails.valueOfPhysicalAssets ? `₦ ${dealRoomDetails.valueOfPhysicalAssets.toLocaleString()}` : "Not provided" 
      },
      { 
        label: "Tentative Business Selling Price", 
        value: dealRoomDetails.tentativeSellingPrice ? `₦ ${dealRoomDetails.tentativeSellingPrice.toLocaleString()}` : "Not provided" 
      },
      { 
        label: "Reason for Sale", 
        value: dealRoomDetails.reasonForSale || "Not provided" 
      },
    ];
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return <Loading isVisible={loading} />;
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Only show "No fundability details found" if data has been fetched (not loading) 
  // and either businessDetails or fundabilityDetails is missing
  if (dataFetched && (!businessDetails || !fundabilityDetails)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No fundability details found.</p>
      </div>
    );
  }

  // If we're still waiting for data and not in an error state, show loading
  if (!businessDetails || !fundabilityDetails) {
    return <Loading isVisible={true} />;
  }

  const documents: Document[] = mapFundabilityDocsToDocuments();

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />
      
      {/* Fundability Score Section */}
      <div className="py-6">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/fundability.svg"
            alt="Fundability"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Fundability Score
        </p>
        <CircularProgress2 
          size={90} 
          textSize="15px" 
          percentage={fundabilityDetails.score || 0} 
        />
        <div className="mt-4">
          <Link 
            href={`/dashboard/businesses/business-details?id=${businessId}`}
            className="text-xs border-mainGray border rounded py-2 px-4 hover:bg-gray-100"
          >
            Back to Business Details
          </Link>
        </div>
      </div>
      
      {/* Business Overview Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Business"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Business Overview
        </p>
        <InfoGrid items={generateBusinessDataItems()} />
      </div>
      
      {/* General Information Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
        <Image
            src="/business.svg"
            alt="Business"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          General Information
        </p>
        <div className="grid grid-cols-1  gap-8">
          <div>
            <InfoGrid 
              items={[
                { label: "Registered Company", value: fundabilityDetails.registeredCompany ? "Yes" : "No" },
                { label: "Legal Name", value: fundabilityDetails.legalName || "Not provided" },
                { label: "Type of Company Registration", value: fundabilityDetails.companyRegistration || "Not provided" },
                { label: "City", value: fundabilityDetails.city || "Not provided" },
                { label: "Registered Address", value: fundabilityDetails.registeredAddress || "Not provided" },
                { label: "Current Business Stage", value: fundabilityDetails.startupStage || "Not provided" },
                { label: "Position", value: fundabilityDetails.position || "Not provided" },
                { label: "Title", value: fundabilityDetails.title || "Not provided" },
              ]} 
            />
          </div>
          <div>
            <InfoGrid 
              items={[
                { label: "Company Email Address", value: fundabilityDetails.companyEmail || "Not provided" },
                { label: "Contact Number", value: fundabilityDetails.contactNumber || "Not provided" },
                { label: "Principal Address", value: fundabilityDetails.principalAddress || "Not provided" },
                { label: "Applicant's Email Address", value: fundabilityDetails.applicantsAddress || "Not provided" },
                { label: "Years of Operation", value: fundabilityDetails.yearsOfOperation?.toString() || "Not provided" },
                { label: "Company Size (Number of Employees)", value: fundabilityDetails.companySize?.toString() || "Not provided" },
                { label: "Has your company been involved in a legal case?", value: fundabilityDetails.companyLegalCases ? "Yes" : "No" },
              ]} 
            />
          </div>
        </div>
      </div>
      
      {/* Business Structure Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
        <Image
            src="/business.svg"
            alt="Business"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Business Structure
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ownership */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-green-600 font-medium mb-4">Ownership</h3>
            <div className="space-y-4">
              {fundabilityDetails.ownership?.map((owner: string, index: number) => (
                <div key={`owner-${index}`} className="border-t pt-2">
                  <p className="text-gray-600 text-sm mb-1">Owner {index + 1}</p>
                  <p className="font-medium text-sm">{owner}</p>
                </div>
              ))}
              {(!fundabilityDetails.ownership || fundabilityDetails.ownership.length === 0) && (
                <p className="text-gray-500 text-sm">No ownership information provided</p>
              )}
            </div>
          </div>
          
          {/* Executive Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-green-600 font-medium mb-4">Executive Management</h3>
            <div className="space-y-4">
              {fundabilityDetails.executiveManagement?.map((exec: string, index: number) => (
                <div key={`exec-${index}`} className="border-t pt-2">
                  <p className="text-gray-600 text-sm mb-1">Executive Management {index + 1}</p>
                  <p className="font-medium text-sm">{exec}</p>
                </div>
              ))}
              {(!fundabilityDetails.executiveManagement || fundabilityDetails.executiveManagement.length === 0) && (
                <p className="text-gray-500 text-sm">No executive management information provided</p>
              )}
            </div>
          </div>
          
          {/* Legal Advisors */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-green-600 font-medium mb-4">Legal Advisors</h3>
            <div className="space-y-4">
              {fundabilityDetails.legalAdvisors?.map((advisor: string, index: number) => (
                <div key={`advisor-${index}`} className="border-t pt-2">
                  <p className="text-gray-600 text-sm mb-1">Legal Advisor {index + 1}</p>
                  <p className="font-medium text-sm">{advisor}</p>
                </div>
              ))}
              {(!fundabilityDetails.legalAdvisors || fundabilityDetails.legalAdvisors.length === 0) && (
                <p className="text-gray-500 text-sm">No legal advisor information provided</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Board of Directors */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-green-600 font-medium mb-4">Board of Directors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundabilityDetails.boardOfDirectors?.map((director: string, index: number) => (
              <div key={`director-${index}`} className="border-t pt-2">
                <p className="text-gray-600 text-sm mb-1">Director {index + 1}</p>
                <p className="font-medium text-sm">{director}</p>
              </div>
            ))}
            {(!fundabilityDetails.boardOfDirectors || fundabilityDetails.boardOfDirectors.length === 0) && (
              <p className="text-gray-500 text-sm">No board of directors information provided</p>
            )}
          </div>
        </div>
        
        {/* ISIC Information */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-green-600 font-medium mb-4">ISIC Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 text-sm mb-1">ISIC Industry</p>
              <p className="font-medium text-sm">{fundabilityDetails.isicIndustry ? fundabilityDetails.industry : "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">ISIC Activities</p>
              <p className="font-medium text-sm">{fundabilityDetails.isicActivity || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Information Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/dollar.svg"
            alt="Financial"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Financial Information
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InfoGrid 
              items={[
                { label: "Average Annual Revenue", value: fundabilityDetails.averageAnnualRevenue ? `₦ ${fundabilityDetails.averageAnnualRevenue.toLocaleString()}` : "Not provided" },
                { label: "Revenue Growth Rate", value: fundabilityDetails.revenueGrowthRate ? `${fundabilityDetails.revenueGrowthRate}%` : "Not provided" },
                { label: "Audited Financial Statement", value: fundabilityDetails.auditedFinancialStatement ? "Yes" : "No" },
                { label: "Company has a 5-year financial cashflow?", value: fundabilityDetails.company5yearCashFlow ? "Yes" : "No" },
                { label: "Company has been 3 years profitable?", value: fundabilityDetails.company3YearProfitable ? "Yes" : "No" },
              ]} 
            />
          </div>
          <div>
            <InfoGrid 
              items={[
                { label: "Company has a Pitch Deck?", value: fundabilityDetails.companyPitchDeck ? "Yes" : "No" },
                { label: "Company has a Business Plan?", value: fundabilityDetails.companyBusinessPlan ? "Yes" : "No" },
                { label: "Company possesses Solid Asset Holding?", value: fundabilityDetails.companySolidAssetHolding ? "Yes" : "No" },
                { label: "Company possesses a Large Inventory Value?", value: fundabilityDetails.companyLargeInventory ? "Yes" : "No" },
                { label: "Company has a High Growth Potential", value: fundabilityDetails.companyHighScalibilty ? "Yes" : "No" },
                { label: "Company possesses any current liabilities?", value: fundabilityDetails.companyCurrentLiabilities ? "Yes" : "No" },
                { label: "Owner/proprietor possesses any current liabilities?", value: fundabilityDetails.ownerCurrentLiabilities ? "Yes" : "No" },
              ]} 
            />
          </div>
        </div>
      </div>
      
      {/* Business Documents Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/doc.png"
            alt="Documents"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Business Documents
        </p>
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc: Document) => (
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
        ) : (
          <p className="text-gray-500 text-center py-8 border border-gray-200 rounded">No documents available</p>
        )}
      </div>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
        document={previewDoc} 
      />
    </div>
  );
};

export default FundabilityDetailsPage;
"use client";
import Breadcrumb from "@/app/components/BreadCrumb";
import Header from "@/app/components/Header";
import DocumentCard from "@/app/components/DocumentCard";
import { InfoGrid, InfoGridItem } from "@/app/components/infoGrid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/Table";
import { StatusBadge4 } from "@/app/components/StatusBadge4";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInvestorStore } from "@/app/store/useInvestorStore";
import { format } from "date-fns";
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
const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen || !document) return null;

  // Determine content type based on fileType
  const isImage = document.fileType === "JPG" || document.fileType === "PNG";
  const imageLoader = ({ src }: any) => {
    return `${src}`;
  };

  // Handle file download
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Use window.document to explicitly access the DOM Document interface
    const link = window.document.createElement("a");
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
            {document.fileType} · {document.fileSize} ·{" "}
            {document.date
              ? format(new Date(document.date), "dd MMM yyyy")
              : "No date"}
          </div>
          <Link href={document.downloadUrl} passHref legacyBehavior>
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

// Main InvestorDetailsPage component
const InvestorDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const investorId: string = searchParams.get("investorId") || "";

  const {
    investor,
    proposals,
    proposalsReceived,
    loading,
    loadingProposals,
    loadingProposalsReceived,
    error,
    errorProposals,
    errorProposalsReceived,
    getInvestorById,
    getProposalsSent,
    getProposalsReceived
  } = useInvestorStore();

  // Use refs to track if we've already fetched proposals for this investor ID
  const proposalsSentFetchedRef = useRef<string | null>(null);
  const proposalsReceivedFetchedRef = useRef<string | null>(null);

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // Load investor data when component mounts or investorId changes
  useEffect(() => {
    if (investorId) {
      getInvestorById(investorId);
      setDataFetched(true);
    }
  }, [investorId, getInvestorById]);

  // Load proposals sent data when investor details are loaded
  useEffect(() => {
    // Only fetch if investorId exists and we haven't fetched for this ID yet
    if (investorId && proposalsSentFetchedRef.current !== investorId) {
      // Set the ref immediately to prevent multiple fetches
      proposalsSentFetchedRef.current = investorId;

      // Get proposals sent
      getProposalsSent(investorId);
    }
  }, [investorId, getProposalsSent]);

  // Load proposals received data when investor details are loaded
  useEffect(() => {
    // Only fetch if investorId exists and we haven't fetched for this ID yet
    if (investorId && proposalsReceivedFetchedRef.current !== investorId) {
      // Set the ref immediately to prevent multiple fetches
      proposalsReceivedFetchedRef.current = investorId;

      // Get proposals received
      getProposalsReceived(investorId);
    }
  }, [investorId, getProposalsReceived]);

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

  // Format date string for table (shorter version)
  const formatTableDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Parse JSON string into array
  const parseJsonString = (jsonString: string | undefined): string[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [];
    }
  };

  // Map API data to documents
  const mapDocsToDocuments = (): Document[] => {
    if (!investor) return [];

    const docs: Document[] = [];

    // Terms of Agreement Document
    if (investor.termsOfAgreementDocUrl) {
      const fileType: string = getFileTypeFromUrl(
        investor.termsOfAgreementDocUrl
      );

      docs.push({
        id: "termsOfAgreement",
        title: "Terms of Agreement",
        fileType,
        fileSize: "2.5 MB", // Placeholder size
        downloadUrl: investor.termsOfAgreementDocUrl,
        date: investor.updatedAt,
      });
    }

    // Proof of Business Document
    if (investor.proofOfBusinessDocUrl) {
      const fileType: string = getFileTypeFromUrl(
        investor.proofOfBusinessDocUrl
      );

      docs.push({
        id: "proofOfBusiness",
        title: "Proof of Business",
        fileType,
        fileSize: "3.2 MB", // Placeholder size
        downloadUrl: investor.proofOfBusinessDocUrl,
        date: investor.updatedAt,
      });
    }

    return docs;
  };

  // Helper to get file type from URL
  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return "PDF";

    switch (extension) {
      case "jpg":
      case "jpeg":
        return "JPG";
      case "png":
        return "PNG";
      case "pdf":
        return "PDF";
      default:
        return "PDF";
    }
  };

  // Generate investor data items
  const generateInvestorDataItems = (): InfoGridItem[] => {
    if (!investor) return [];

    return [
      { label: "Company Name", value: investor.companyName },
      { label: "Email", value: investor.email },
      { label: "Phone Number", value: investor.phoneNumber || "Not provided" },
      { label: "Designation", value: investor.designation },
      { label: "Company Type", value: investor.companyType.replace(/_/g, " ") },
      { label: "Location", value: investor.location },
      { label: "Website", value: investor.companyWebsiteUrl || "Not provided" },
      { label: "Joined", value: formatDate(investor.createdAt) },
    ];
  };

  // Image loader function for business logos
  const imageLoader = ({ src }: any) => {
    return `${src}`;
  };

  // Render the proposals sent table or a message if no proposals
  const renderProposalsSentTable = () => {
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
            <TableHeader>Business</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Buying Price</TableHeader>
            <TableHeader>Proposal</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {proposals.map((proposal) => (
            <TableRow
              key={proposal.id}
              link={`/dashboard/investors/details/proposals?id=${proposal.publicId}`}
            >
              <TableCell>{formatTableDate(proposal.createdAt)}</TableCell>
              <TableCell className="flex items-center gap-2">
                {proposal.business?.businessLogoUrl ? (
                  <Image
                    src={proposal.business.businessLogoUrl}
                    loader={imageLoader}
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                    alt={proposal.business.businessName}
                  />
                ) : null}
                {proposal.business?.businessName || "Unknown"}
              </TableCell>
              <TableCell>{proposal.business?.businessEmail || "N/A"}</TableCell>
              <TableCell>
                {proposal.buyingPrice
                  ? `₦${parseInt(proposal.buyingPrice).toLocaleString()}`
                  : "N/A"}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {proposal.proposal || "N/A"}
              </TableCell>
              <TableCell>
                <StatusBadge4 status={proposal.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Render the proposals received table or a message if no proposals
  const renderProposalsReceivedTable = () => {
    if (loadingProposalsReceived) {
      return (
        <div className="text-center py-8 border border-gray-200 rounded">
          <Loading isVisible={true} />
        </div>
      );
    }

    if (!proposalsReceived || proposalsReceived.length === 0) {
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
            <TableHeader>Business</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Selling Price</TableHeader>
            <TableHeader>Proposal</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {proposalsReceived.map((proposal) => (
            <TableRow
              key={proposal.id}
              link={`/dashboard/investors/details/proposals-received?id=${proposal.publicId}`}
            >
              <TableCell>{formatTableDate(proposal.createdAt)}</TableCell>
              <TableCell className="flex items-center gap-2">
                {proposal.business?.businessLogoUrl ? (
                  <Image
                    src={proposal.business.businessLogoUrl}
                    loader={imageLoader}
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                    alt={proposal.business.businessName}
                  />
                ) : null}
                {proposal.business?.businessName || "Unknown"}
              </TableCell>
              <TableCell>{proposal.business?.businessEmail || "N/A"}</TableCell>
              <TableCell>
                {proposal.sellingPrice
                  ? `₦${parseInt(proposal.sellingPrice).toLocaleString()}`
                  : "N/A"}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {proposal.proposal || "N/A"}
              </TableCell>
              <TableCell>
                <StatusBadge4 status={proposal.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
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

  // Only show "No details found" if data has been fetched (not loading)
  // and the required details are missing
  if (dataFetched && !investor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No investor details found for this ID.</p>
      </div>
    );
  }

  // If we're still waiting for data and not in an error state, show loading
  if (!investor) {
    return <Loading isVisible={true} />;
  }

  const documents: Document[] = mapDocsToDocuments();

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />

      {/* Investor Profile Header */}
      <div className="py-6 flex justify-between items-start">
        <div className="flex items-start gap-4">
          {investor.companyLogoUrl && (
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={investor.companyLogoUrl}
                alt={`${investor.companyName} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-logo.png"; // Fallback image
                }}
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{investor.companyName}</h2>
            <p className="text-gray-600">
              {investor.companyType.replace(/_/g, " ")}
            </p>
            <div className="mt-4">
              <Link
                href={`/dashboard/investors`}
                className="text-xs border-mainGray border rounded py-2 px-4 hover:bg-gray-100"
              >
                Back to Investors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Overview Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Investor"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Investor Overview
        </p>
        <InfoGrid items={generateInvestorDataItems()} />
      </div>

      {/* About Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="About"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          About
        </p>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700">
            {investor.about || "No about information provided."}
          </p>
        </div>
      </div>

      {/* Investment Preferences Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/dollar.svg"
            alt="Investment"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Investment Preferences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InfoGrid
              items={[
                {
                  label: "Funds Under Management",
                  value: investor.fundsUnderManagement
                    ?  "₦" + investor.fundsUnderManagement
                    : "Not provided",
                },
                {
                  label: "Expected Deals",
                  value: investor.numOfExpectedDeals
                    ? investor.numOfExpectedDeals
                        .replace(/_/g, " ")
                        .toLowerCase()
                    : "Not provided",
                },
              ]}
            />
          </div>
        </div>

        {/* Interested Locations */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-green-600 font-medium mb-4">
            Interested Locations
          </h3>
          <div className="flex flex-wrap gap-2">
            {parseJsonString(investor.interestedLocations).map(
              (location, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {location.replace(/"/g, "")}
                </span>
              )
            )}
            {parseJsonString(investor.interestedLocations).length === 0 && (
              <p className="text-gray-500">No preferred locations specified</p>
            )}
          </div>
        </div>

        {/* Interested Factors */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-green-600 font-medium mb-4">Interest Areas</h3>
          <div className="flex flex-wrap gap-2">
            {parseJsonString(investor.interestedFactors).map(
              (factor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  {factor.replace(/"/g, "")}
                </span>
              )
            )}
            {parseJsonString(investor.interestedFactors).length === 0 && (
              <p className="text-gray-500">No interest areas specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Proposals Sent Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Proposals"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Proposals Sent
        </p>
        {errorProposals ? (
          <div className="text-center py-8 border border-gray-200 rounded">
            <p className="text-red-500">Error: {errorProposals}</p>
          </div>
        ) : (
          renderProposalsSentTable()
        )}
      </div>

      {/* Proposals Received Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Proposals"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Proposals Received
        </p>
        {errorProposalsReceived ? (
          <div className="text-center py-8 border border-gray-200 rounded">
            <p className="text-red-500">Error: {errorProposalsReceived}</p>
          </div>
        ) : (
          renderProposalsReceivedTable()
        )}
      </div>

      {/* Documents Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/doc.png"
            alt="Documents"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Investor Documents
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
          <p className="text-gray-500 text-center py-8 border border-gray-200 rounded">
            No documents available
          </p>
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

export default InvestorDetailsPage;
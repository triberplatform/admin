"use client";
import Breadcrumb from "@/app/components/BreadCrumb";
import Header from "@/app/components/Header";
import { InfoGrid, InfoGridItem } from "@/app/components/infoGrid";
import { StatusBadge4 } from "@/app/components/StatusBadge4";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBusinessStore } from "@/app/store/useBusinessStore";
import { format } from "date-fns";
import Loading from "@/app/loading";
import { ProposalRecievedBusiness } from "@/app/types/response";

const ProposalReceivedDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const proposalId: string = searchParams.get("id") || "";

  const {
    proposalsRecieved,
    loading,
    loadingProposals,
    error,
    errorProposals,
    getProposalsRecieved,
  } = useBusinessStore();

  const [proposal, setProposal] = useState<ProposalRecievedBusiness | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // Get businessId from URL or local storage if needed
  useEffect(() => {
    // Check if we already have proposals data
    if (proposalsRecieved.length > 0 && proposalId) {
      // Find the specific proposal by public ID
      const foundProposal: ProposalRecievedBusiness | undefined = proposalsRecieved.find(p => p.publicId === proposalId);
      setProposal(foundProposal || null);
      setDataFetched(true);
    } else if (proposalId) {
      // If we don't have proposals data but have an ID, we need to fetch the business's proposals
      const currentPath: string = window.location.pathname;
      // Extract business ID from URL if it's present in the referrer
      const referrer: string = document.referrer;
      const businessIdMatch: RegExpMatchArray | null = referrer.match(/id=([^&]*)/);
      const businessId: string | null = businessIdMatch ? businessIdMatch[1] : null;
      
      if (businessId) {
        getProposalsRecieved(businessId);
      } else {
        // If we can't determine the businessId, redirect back
        router.push('/dashboard/businesses');
      }
    }
  }, [proposalId, proposalsRecieved, getProposalsRecieved, router]);

  // Update proposal when proposals are loaded
  useEffect(() => {
    if (proposalsRecieved.length > 0 && proposalId) {
      const foundProposal: ProposalRecievedBusiness | undefined = proposalsRecieved.find(p => p.publicId === proposalId);
      setProposal(foundProposal || null);
      setDataFetched(true);
    }
  }, [proposalsRecieved, proposalId]);

  // Format date string
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "EEEE, dd MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Image loader function for business logos
  const imageLoader = ({ src }: { src: string }): string => {
    return `${src}`;
  };

  // Generate proposal data items
  const generateProposalDataItems = (): InfoGridItem[] => {
    if (!proposal) return [];

    return [
      { label: "Investor", value: proposal.investor?.companyName || "Unknown" },
      { label: "Email", value: proposal.investor?.email || "Not provided" },
      { label: "Date", value: formatDate(proposal.createdAt) },
      { label: "Buying Price", value: proposal.buyingPrice ? `₦${parseInt(proposal.buyingPrice).toLocaleString()}` : "Not specified" },
      { label: "Status", value: <StatusBadge4 status={proposal.status} /> },
    ];
  };

  // Show loading indicator while data is being fetched
  if (loadingProposals) {
    return <Loading isVisible={true} />;
  }

  // Show error message if there was an error fetching data
  if (errorProposals) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {errorProposals}</p>
      </div>
    );
  }

  // Only show "No details found" if data has been fetched (not loading)
  // and the required details are missing
  if (dataFetched && !proposal) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No proposal details found for this ID.</p>
      </div>
    );
  }

  // If we're still waiting for data and not in an error state, show loading
  if (!proposal) {
    return <Loading isVisible={true} />;
  }

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />

      {/* Proposal Header */}
      <div className="py-6 flex justify-between items-start">
        <div className="flex items-start gap-4">
          {proposal.investor?.companyLogoUrl ? (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={proposal.investor.companyLogoUrl}
                loader={imageLoader}
                width={64}
                height={64}
                alt={`${proposal.investor.companyName} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-logo.png"; // Fallback image
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-2xl text-gray-400">I</span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">
              {proposal.buyingPrice 
                ? `₦${parseInt(proposal.buyingPrice).toLocaleString()}` 
                : "Proposal Details"}
            </h2>
            <div className="mt-1">
              <StatusBadge4 status={proposal.status} />
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard/businesses"
                className="text-xs border-mainGray border rounded py-2 px-4 hover:bg-gray-100"
              >
                Back to Businesses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Overview Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="Proposal"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Proposal Overview
        </p>
        <InfoGrid items={generateProposalDataItems()} />
      </div>

      {/* Proposal Content Section */}
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/doc.png"
            alt="Proposal"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Proposal Details
        </p>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 whitespace-pre-line">
            {proposal.proposal || "No proposal details provided."}
          </p>
        </div>
      </div>

      {/* Additional Details Section (if needed) */}
      {proposal.fundingAmount && (
        <div className="mt-10 mb-10">
          <p className="font-semibold items-center mb-5 flex gap-2">
            <Image
              src="/dollar.svg"
              alt="Funding"
              width={20}
              height={20}
              className="object-cover"
            />{" "}
            Funding Information
          </p>
          <div className="border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700">
              <span className="font-semibold">Funding Amount: </span>
              {`₦${parseInt(proposal.fundingAmount).toLocaleString()}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalReceivedDetailsPage;
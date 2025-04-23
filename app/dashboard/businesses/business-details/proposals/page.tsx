"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBusinessStore } from '@/app/store/useBusinessStore';
import Breadcrumb from "@/app/components/BreadCrumb";
import Header from "@/app/components/Header";
import { InfoGrid } from "@/app/components/infoGrid";
import { StatusBadge3 } from "@/app/components/StatusBadge3";
import Image from "next/image";
import Loading from "@/app/loading";
import { format } from "date-fns";
import { ProposalSentBusiness } from "@/app/types/response";

const imageLoader = ({src}:any) => {
  return `${src}`;
}

export default function ProposalDetailsPage() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("id") || "";
  
  const {
    proposals,
    loadingProposals,
    errorProposals,
    getProposalsSent
  } = useBusinessStore();

  // State to track proposal data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the business ID from URL if needed (from the previous page)
  const businessId = searchParams.get("businessId") || "";

  // Fetch proposals when component mounts
  useEffect(() => {
    if (businessId) {
      getProposalsSent(businessId);
    }
  }, [businessId, getProposalsSent]);

  // Find the proposal using array.find
  const proposal = proposalId ? proposals.find(p => p.publicId === proposalId) : null;

  // Update loading state when proposals are loaded
  useEffect(() => {
    if (!loadingProposals) {
      setLoading(false);
    }
  }, [loadingProposals]);

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, dd MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Generate info grid items
  const generateInfoGridItems = () => {
    if (!proposal) return [];

    return [
      { 
        label: "Investor", 
        value: proposal.investor?.companyName || "Unknown" 
      },
      { 
        label: "Email", 
        value: proposal.investor?.email || "N/A" 
      },
      { 
        label: "Date", 
        value: formatDate(proposal.createdAt)
      },
      // We don't have location in the data, using N/A as placeholder
      { 
        label: "Location", 
        value: proposal.investor?.location || "N/A" 
      },
      { 
        label: "Proposed Amount", 
        value: proposal.sellingPrice ? `₦${parseInt(proposal.sellingPrice).toLocaleString()}` : 'N/A'
      },
      { 
        label: "Status", 
        value: <StatusBadge3 status={proposal.status} />
      },
    ];
  };

  // Show loading indicator
  if (loading || loadingProposals) {
    return <Loading isVisible={true} />;
  }

  // Show error message
  if (errorProposals) {
    return (
      <div className="px-6 ml-[20%]">
        <Header />
        <Breadcrumb />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{errorProposals}</p>
        </div>
      </div>
    );
  }

  // Show not found message if no proposal is found
  if (!proposal) {
    return (
      <div className="px-6 ml-[20%]">
        <Header />
        <Breadcrumb />
        <div className="flex justify-center items-center h-64">
          <p>Proposal not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 ml-[20%]">
      <Header />
      <Breadcrumb />
      <div className="flex mt-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-full">
            {proposal.investor?.companyLogoUrl ? (
              <Image
                src={proposal.investor.companyLogoUrl}
                loader={imageLoader}
                alt={proposal.investor.companyName}
                width={62}
                height={62}
                className="object-cover rounded-full"
              />
            ) : (
              <Image
                src="/main-business.svg"
                alt="Investor"
                width={62}
                height={62}
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xl font-medium">
              {proposal.sellingPrice ? `₦${parseInt(proposal.sellingPrice).toLocaleString()}` : 'No Amount Specified'}
            </p>
            <p className="text-mainGray text-sm mt-1">
              <StatusBadge3 status={proposal.status} />
            </p>
          </div>
        </div>
      </div>
      
      <div className="my-10">
        <InfoGrid items={generateInfoGridItems()} />
      </div>
      
      <div className="my-10">
        <h2 className="font-semibold text-lg mb-5">Proposal Details</h2>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-700 whitespace-pre-line">{proposal.proposal || "No proposal details available."}</p>
        </div>
      </div>
    </div>
  );
}
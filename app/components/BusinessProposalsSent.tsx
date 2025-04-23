"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBusinessStore } from '@/app/store/useBusinessStore';
import { format } from 'date-fns';
import { ProposalSentBusiness } from '@/app/types/response';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/Table';
import { StatusBadge2 } from '@/app/components/StatusBadge2';
import Image from 'next/image';
import Loading from '@/app/loading';

const imageLoader = ({src}: any) => {
  return `${src}`;
}

export default function BusinessProposalsTable(): React.ReactElement {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id") || "";
  
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);
  
  const {
    proposals,
    loading,
    error,
    getProposalsSent
  } = useBusinessStore();

  // Load proposals data when component mounts or businessId changes
  useEffect(() => {
    if (businessId && !hasAttemptedFetch) {
      getProposalsSent(businessId)
        .finally(() => {
          setHasAttemptedFetch(true);
        });
    }
  }, [businessId, getProposalsSent, hasAttemptedFetch]);

  // Format the date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Always show loading indicator when loading is true
  if (loading && !hasAttemptedFetch) {
    return <Loading isVisible={loading} />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="text-center py-8 border border-gray-200 rounded">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Only show "No proposals found" after we've attempted to fetch data AND there are no proposals
  if (hasAttemptedFetch && (!proposals || proposals.length === 0)) {
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
          <TableRow key={proposal.id} link={`/dashboard/businesses/business-details/proposal-details?id=${proposal.publicId}`}>
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
            <TableCell><StatusBadge2 status={proposal.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
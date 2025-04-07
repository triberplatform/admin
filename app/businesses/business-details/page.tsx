"use client";
import Breadcrumb from "@/app/components/BreadCrumb";
import CircularProgress from "@/app/components/CircularProgress";
import CircularProgress2 from "@/app/components/CircularProgress2";
import EditBusinessModal from "@/app/components/Forms/EditBusiness";
import UpdateFundabilityScoreModal from "@/app/components/Forms/UpdateFundability";
import Header from "@/app/components/Header";
import { InfoGrid, InfoGridItem } from "@/app/components/infoGrid";
import EditUserFailureModal from "@/app/components/Modals/EditUserFailure";
import EditUserSuccessModal from "@/app/components/Modals/EditUserSuccess";
import SuspendUserSuccessModal from "@/app/components/Modals/SuspendUser";
import SuspendUserFailureModal from "@/app/components/Modals/SuspendUserFailure";
import UpdateScoreSuccessModal from "@/app/components/Modals/UpdateFundabilityModal";
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
import React, { useState } from "react";

// Type definitions
interface BusinessData {
  businessName: string;
  location: string;
  industry: string;
  established: string;
  ownershipType: string;
}

interface ScoreHistoryItem {
  timestamp: string;
  score: number;
  reason: string;
  updatedBy: string;
}

interface UpdateScoreData {
  newScore: string | number;
  reason: string;
}

const sampleItems: InfoGridItem[] = [
  { label: "Owner", value: "Emeka Okechukwu" },
  { label: "Email", value: "emeka.okechukwu@email.com" },
  { label: "Phone Number", value: "+234 801 234 5679" },
  { label: "Location", value: "Lagos, Nigeria." },
  { label: "Industry", value: "Agriculture" },
  { label: "Established", value: "Monday, 10 March 2025" },
  { label: "Ownership Type", value: "Sole Proprietorship" },
  {
    label: "Verification Status",
    value: (
      <div className="flex items-center">
        <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>Verified
      </div>
    ),
  },
];

export default function Page(): React.ReactElement {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState<boolean>(false);
  const [isEditFailureModalOpen, setIsEditFailureModalOpen] = useState<boolean>(false);
  const [isSuspendFailureModalOpen, setIsSuspendFailureModalOpen] = useState<boolean>(false);
  const [isEditFundabilityModalOpen, setIsEditFundabilityModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [updateReason, setUpdateReason] = useState<string>("");
  const [fundabilityScore, setFundabilityScore] = useState<number>(75);
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: "Okechukwu Agro Ventures",
    location: "Lagos, Nigeria.",
    industry: "Agriculture",
    established: "10 Mar 2025",
    ownershipType: "Sole Proprietorship",
  });
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([
    {
      timestamp: "2025-03-15T10:30:00Z",
      score: 75,
      reason: "Initial assessment based on financial documents and business model.",
      updatedBy: "System",
    },
  ]);

  const handleRetryEdit = (): void => {
    setIsEditFailureModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleRetrySuspend = (): void => {
    setIsSuspendFailureModalOpen(false);
    setIsEditFundabilityModalOpen(true);
  };

  const handleUpdateScore = (data: UpdateScoreData): void => {
    const numericScore = Number(data.newScore);

    // Update the current score
    setFundabilityScore(numericScore);
    setUpdateReason(data.reason);

    // Close the update modal
    setIsEditFundabilityModalOpen(false);
    
    // Show the success modal
    setIsSuccessModalOpen(true);

    // Add to history
    setScoreHistory([
      {
        timestamp: new Date().toISOString(),
        score: numericScore,
        reason: data.reason,
        updatedBy: "Current User", // This would typically come from your auth system
      },
      ...scoreHistory,
    ]);

    console.log("Score updated:", numericScore, "Reason:", data.reason);
    // Here you would typically make an API call to update the score
  };

  const handleUpdate = (updatedData: BusinessData): void => {
    setBusinessData(updatedData);
    setIsEditSuccessModalOpen(true);
    console.log("Business updated:", updatedData);

    // Here you would typically make an API call to update the business data
  };
  
  return (
    <div className="px-6">
      <Header />
      <Breadcrumb />
      <div className="flex mt-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-full">
            <Image
              src="/main-business.svg"
              alt="User"
              width={62}
              height={62}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xl font-medium">Okechukwu Agro Ventures</p>
            <p className="text-mainGray text-sm mt-1">
              {" "}
              <StatusBadge status="Awaiting Proposal" />
            </p>
          </div>
        </div>
        <div className="gap-3 flex items-center text-xs">
          <button
            className="border px-4 py-2 border-black rounded"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>
      <p className="text-mainGray text-sm mt-5">
        Inovatev is a forward-thinking company dedicated to driving innovation
        and digital transformation for businesses of all sizes.
      </p>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/business.svg"
            alt="User"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Business
        </p>
        <InfoGrid items={sampleItems} />
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/fundability.svg"
            alt="User"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Fundability
        </p>
        <div className="flex justify-between">
          <CircularProgress2 size={90} textSize="15px" percentage={75} />
          <div className="flex gap-2 text-xs">
            <button>
              {" "}
              <Link href={'/users/details/business-details/fundability-details'} className="border-mainGray border rounded py-2 px-4">
                View Fundability Details
              </Link>
            </button>
            <button onClick={()=>setIsEditFundabilityModalOpen(true)}>
              <span className="border-mainGray border rounded py-2 px-4">
                Update Score
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center  flex gap-2">
          <Image
            src="/valuation.svg"
            alt="User"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Valuation
        </p>
        <p className="text-mainGray text-sm mb-5">Prepared 11 March, 2025</p>
      </div>
      <div className="px-5 py-5 border border-gray-200 rounded-xl">
        <p className="text-mainGreen font-medium  mb-4">Valuation Summary</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-gray-600 text-sm mb-1">Valuation Range</p>
            <p className="font-medium text-xs">₦ 200 M - ₦ 500 M</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">
              Current Fundability Score
            </p>
            <p className="font-medium text-xs">75%</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Investment potential</p>
            <p className="font-medium text-xs">High Growth Potential</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-mainGreen font-medium  mb-4">
            Key Valuation Metrics
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
            <div>
              <p className="text-gray-600 text-sm mb-1">Annual Revenue</p>
              <p className="font-medium text-xs">₦ 200,000,000</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">EBITDA</p>
              <p className="font-medium text-xs">₦ 200,000,000</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Net Profit Margin</p>
              <p className="font-medium text-xs">5%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Growth Rate</p>
              <p className="font-medium text-xs">15%</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="my-10">
          <p className="font-semibold flex gap-1 items-center mb-5">
            <Image
              src="/business.svg"
              alt="User"
              width={20}
              height={20}
              className="object-cover"
            />{" "}
            Proposals Sent
          </p>
          <Table>
            <TableHead>
              <TableRow  className="bg-gray-100">
                <TableHeader>Date</TableHeader>
                <TableHeader>Investor</TableHeader>
                <TableHeader>Industry</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Proposed Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* You can map through your data here */}
              <TableRow link="/businesses/business-details/proposals">
                <TableCell>11 Mar 2025</TableCell>
                <TableCell>Emeka Okechukwu</TableCell>
                <TableCell>Fashion Design</TableCell>
                <TableCell>testeremail@gmail.com</TableCell>
                <TableCell>₦200 M</TableCell>
                <TableCell>
                  <StatusBadge2 status="Accepted" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11 Mar 2025</TableCell>
                <TableCell>Emeka Okechukwu</TableCell>
                <TableCell>Fashion Design</TableCell>
                <TableCell>testeremail@gmail.com</TableCell>
                <TableCell>₦200 M</TableCell>
                <TableCell>
                  <StatusBadge2 status="Accepted" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11 Mar 2025</TableCell>
                <TableCell>Emeka Okechukwu</TableCell>
                <TableCell>Fashion Design</TableCell>
                <TableCell>testeremail@gmail.com</TableCell>
                <TableCell>₦200 M</TableCell>
                <TableCell>
                  <StatusBadge2 status="Accepted" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <EditBusinessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        businessData={businessData}
        onUpdate={handleUpdate}
      />
      <UpdateFundabilityScoreModal
        isOpen={isEditFundabilityModalOpen}
        onClose={() => setIsEditFundabilityModalOpen(false)}
        currentScore={fundabilityScore}
        onUpdateScore={handleUpdateScore}
      />
      <EditUserSuccessModal
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
        newScore={fundabilityScore}
        reason={updateReason}
      />
      <SuspendUserFailureModal
        isOpen={isSuspendFailureModalOpen}
        onClose={() => setIsSuspendFailureModalOpen(false)}
        onRetry={handleRetrySuspend}
      />
    </div>
  );
}
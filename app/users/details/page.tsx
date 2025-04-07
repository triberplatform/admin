'use client'
import React, { useState } from "react";
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
import { Briefcase, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EditUserModal from "@/app/components/Forms/EditUser";
import EditUserSuccessModal from "@/app/components/Modals/EditUserSuccess";
import SuspendUserModal from "@/app/components/Forms/SuspendUser";
import SuspendUserSuccessModal from "@/app/components/Modals/SuspendUser";
import SuspendUserFailureModal from "@/app/components/Modals/SuspendUserFailure";
import EditUserFailureModal from "@/app/components/Modals/EditUserFailure";

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

interface SuspendData {
  duration: string;
  reason: string;
}

// Sample data with proper typing
const sampleItems: InfoGridItem[] = [
  { label: "First Name", value: "Emeka" },
  { label: "Last Name", value: "Okechukwu" },
  { label: "Email", value: "emeka.okechukwu@email.com" },
  { label: "Phone Number", value: "+234 801 234 5679" },
  { label: "Location", value: "Lagos, Nigeria." },
  { label: "Date Joined", value: "Monday, 10 March 2025" },
];

const UserPage: React.FC = () => {
  // State for managing modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState<boolean>(false);
  const [isEditFailureModalOpen, setIsEditFailureModalOpen] = useState<boolean>(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState<boolean>(false);
  const [isSuspendSuccessModalOpen, setIsSuspendSuccessModalOpen] = useState<boolean>(false);
  const [isSuspendFailureModalOpen, setIsSuspendFailureModalOpen] = useState<boolean>(false);
  const [suspendDuration, setSuspendDuration] = useState<string>("");

  // Initial user data
  const [userData, setUserData] = useState<UserData>({
    firstName: "Emeka",
    lastName: "Okechukwu",
    phoneNumber: "+234 801 234 5679",
    location: "Lagos, Nigeria.",
  });

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
  const handleSuspendUser = (suspendData: SuspendData): void => {
    // In a real app, you would make an API call here
    // Simulate a success/failure scenario (for demo purposes)
    if (Math.random() > 0.3) { // 70% success rate
      setSuspendDuration(suspendData.duration);
      setIsSuspendSuccessModalOpen(true);
    } else {
      setIsSuspendFailureModalOpen(true);
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

  return (
    <div className="px-6">
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
            <p className="text-xl font-medium">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-mainGray text-sm">{userData.location}</p>
          </div>
        </div>
        <div className="gap-3 flex items-center text-xs">
          <button
            className="border px-4 py-2 border-black rounded"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
          <button
            className="text-white px-4 py-2 bg-mainPink rounded"
            onClick={() => setIsSuspendModalOpen(true)}
          >
            Suspend User
          </button>
        </div>
      </div>
      
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-1">
          <User size={15} /> Personal Information
        </p>
        <InfoGrid items={sampleItems} />
      </div>
      
      <div className="mt-10">
        <p className="font-semibold flex gap-1 items-center mb-5">
          <Briefcase size={15}/> Businesses
        </p>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableHeader>Business Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Industry</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Documents</TableHeader>
              <TableHeader>Fundability Score</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* You can map through your data here */}
            <TableRow link="/users/details/business-details">
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>SME</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>aisha.bello@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge status="Funded" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>SME</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>aisha.bello@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge status="Pending Response" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bello Fashion House</TableCell>
              <TableCell>SME</TableCell>
              <TableCell>Fashion Design</TableCell>
              <TableCell>aisha.bello@email.com</TableCell>
              <TableCell>doc</TableCell>
              <TableCell>
                <CircularProgress percentage={65} />
              </TableCell>
              <TableCell>
                <StatusBadge status="Awaiting Proposal" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="my-10">
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
            {/* You can map through your data here */}
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
      </div>

      {/* Modal Components */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onUpdate={handleUpdateUser}
      />
      
      <EditUserSuccessModal
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
      />
      
      <SuspendUserSuccessModal
        isOpen={isSuspendSuccessModalOpen}
        onClose={() => setIsSuspendSuccessModalOpen(false)}
        duration={suspendDuration}
      />
      
      <SuspendUserFailureModal
        isOpen={isSuspendFailureModalOpen}
        onClose={() => setIsSuspendFailureModalOpen(false)}
        onRetry={handleRetrySuspend}
      />
    </div>
  );
};

export default UserPage;
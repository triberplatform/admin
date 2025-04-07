import Breadcrumb from "@/app/components/BreadCrumb";
import CircularProgress2 from "@/app/components/CircularProgress2";
import DocumentCard from "@/app/components/DocumentCard";
import Header from "@/app/components/Header";
import { InfoGrid } from "@/app/components/infoGrid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Document {
  id: string;
  title: string;
  fileType?: string; // Optional with ? since we now handle undefined case
  fileSize: string;
  downloadUrl: string;
  date?: string; // Optional date field
}

export default function page() {
  const businessData = [
    { label: "Business Name", value: "Okechukwu Agro Ventures" },
    { label: "Email", value: "emeka.okechukwu@email.com" },
    { label: "Phone Number", value: "+234 801 234 5679" },
    { label: "Business Owner", value: "Emeka Okechukwu" },
    { label: "Ownership Type", value: "Sole Proprietorship" },
    { label: "Location", value: "Lagos, Nigeria." },
    { label: "Industry", value: "Agriculture" },
    { label: "Address", value: "1 Street Name, Area, State, Country." },
    { label: "Established", value: "Monday, 10 March 2025" },
  ];
  const financialData = [
    { label: "Average Monthly Sales", value: "₦ 2,000,000" },
    { label: "Last Reported Yearly Sales", value: "₦ 40,000,000" },
    { label: "EBITDA/Operating Profit Margin Percentage", value: "20%" },
    { label: "Total Asset Valuation", value: "₦ 100,000,000" },
    { label: "Tentative Business Selling Price", value: "₦ 500,000,000" },
    { label: "Reason for Sale", value: "Cashing out." },
  ];
  const document: Document[] = [
    {
      id: "doc1",
      title: "IP & Trademark License",
      fileType: "PDF",
      fileSize: "1.2 MB",
      downloadUrl: "/api/documents/ip-trademark-license",
      date: "2025-03-10",
    },
    {
      id: "doc2",
      title: "Letter of Good Standing",
      fileType: "PDF",
      fileSize: "495 KB",
      downloadUrl: "/api/documents/letter-of-good-standing",
      date: "2025-03-10",
    },
    {
      id: "doc3",
      title: "Status Report",
      fileType: "PDF",
      fileSize: "3.7 MB",
      downloadUrl: "/api/documents/status-report",
      date: "2025-03-11",
    },
    {
      id: "doc4",
      title: "Certificate of incorporation",
      fileType: "JPG",
      fileSize: "680 KB",
      downloadUrl: "/api/documents/certificate-of-incorporation",
      date: "2025-03-09",
    },
    {
      id: "doc5",
      title: "Memorandum of Association",
      fileType: "PDF",
      fileSize: "3.7 MB",
      downloadUrl: "/api/documents/memorandum-of-association",
      date: "2025-03-09",
    },
    {
      id: "doc6",
      title: "Company Liability Schedule",
      fileType: "PDF",
      fileSize: "3.7 MB",
      downloadUrl: "/api/documents/company-liability-schedule",
      date: "2025-03-11",
    },
    {
      id: "doc7",
      title: "Proprietor's Liability Schedule",
      fileType: "PDF",
      fileSize: "3.7 MB",
      downloadUrl: "/api/documents/proprietors-liability-schedule",
      date: "2025-03-11",
    },
  ];
  return (
    <div className="px-6">
      <Header />
      <Breadcrumb />
      <div className=" py-6">
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
        <CircularProgress2 size={90} textSize="15px" percentage={75} />
        <div className="flex gap-2 text-xs">
          {/* <button onClick={()=>setIsEditFundabilityModalOpen(true)}>
              <span className="border-mainGray border rounded py-2 px-4">
                Update Score
              </span>
            </button> */}
        </div>
      </div>
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
        <InfoGrid items={businessData} />
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/doc.png"
            alt="User"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Documents
        </p>
        <InfoGrid items={financialData} />
      </div>
      <div className="mt-10 mb-10">
        <p className="font-semibold items-center mb-5 flex gap-2">
          <Image
            src="/dollar.svg"
            alt="User"
            width={20}
            height={20}
            className="object-cover"
          />{" "}
          Financial Details
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {document.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

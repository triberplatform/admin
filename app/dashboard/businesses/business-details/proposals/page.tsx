import Breadcrumb from "@/app/components/BreadCrumb";
import Header from "@/app/components/Header";
import { InfoGrid } from "@/app/components/infoGrid";
import { StatusBadge2 } from "@/app/components/StatusBadge2";
import Image from "next/image";
import React from "react";

export default function page() {
  const investorData = [
    { label: "Investor", value: "Emeka Okechukwu" },
    { label: "Email", value: "emeka.okechukwu@email.com" },
    { label: "Phone Number", value: "+234 801 234 5679" },
    { label: "Date", value: "Tuesday, 11 March 2025" },
    { label: "Location", value: "Lagos, Nigeria." },
    { label: "Proposed Amount", value: "₦ 200,000,000" },
    { label: "Status", value: <StatusBadge2 status="Pending Response" /> },
  ];

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
            <p className="text-xl font-medium">₦200,000,000</p>
            <p className="text-mainGray text-sm mt-1">
              {" "}
              <StatusBadge2 status="Pending Response" />
            </p>
          </div>
        </div>
      </div>
      <div className="my-10">
        <InfoGrid items={investorData} />
      </div>
    </div>
  );
}
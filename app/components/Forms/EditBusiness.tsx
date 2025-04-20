import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Modal from "../Modal";
import { AlertCircle, Calendar } from "lucide-react";
import { useBusinessStore } from "@/app/store/useBusinessStore";

// Industry enum options - extensive list from RegisterBusiness component
const INDUSTRY_OPTIONS = [
  { value: "IT", label: "IT" },
  { value: "FINANCE", label: "Finance" },
  { value: "HEALTH", label: "Health" },
  { value: "EDUCATION", label: "Education" },
  { value: "MEDIA", label: "Media" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "AEROSPACE", label: "Aerospace" },
  { value: "AUTOMOTIVE", label: "Automotive" },
  { value: "BANKING", label: "Banking" },
  { value: "BIOTECHNOLOGY", label: "Biotechnology" },
  { value: "CHEMICAL", label: "Chemical" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "CONSUMER_GOODS", label: "Consumer Goods" },
  { value: "DEFENSE", label: "Defense" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "ENERGY", label: "Energy" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "ENVIRONMENTAL", label: "Environmental" },
  { value: "FASHION", label: "Fashion" },
  { value: "FOOD_AND_BEVERAGE", label: "Food & Beverage" },
  { value: "GAMING", label: "Gaming" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "HOSPITALITY", label: "Hospitality" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "LEGAL", label: "Legal" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "MARKETING", label: "Marketing" },
  { value: "MINING", label: "Mining" },
  { value: "NONPROFIT", label: "Nonprofit" },
  { value: "OIL_AND_GAS", label: "Oil & Gas" },
  { value: "PHARMACEUTICAL", label: "Pharmaceutical" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "RECREATION", label: "Recreation" },
  { value: "RETAIL", label: "Retail" },
  { value: "SHIPPING", label: "Shipping" },
  { value: "SPORTS", label: "Sports" },
  { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "TRAVEL_AND_TOURISM", label: "Travel & Tourism" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "WASTE_MANAGEMENT", label: "Waste Management" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "OTHER", label: "Other" }
];

// Business Legal Entity options
const LEGAL_ENTITY_OPTIONS = [
  { value: "PRIVATE_LIABILITY_COMPANY", label: "Private Liability Company" },
  { value: "LIMITED_LIABILITY_COMPANY", label: "Limited Liability Company" },
  { value: "PUBLIC_LIMITED_COMPANY", label: "Public Limited Company" },
  { value: "GENERAL_PARTNERSHIP", label: "General Partnership" },
  { value: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" }
];

// Interested In options
const INTERESTED_IN_OPTIONS = [
  { value: "FULL_SALE_OF_BUSINESS", label: "Full Sale of Business" },
  { value: "PARTIAL_STAKE", label: "Partial Stake" },
  { value: "DEBT_FUNDING", label: "Debt Funding" },
  { value: "SELL_OR_LEASE_OF_BUSINESS_ASSETS", label: "Sell or Lease Business Assets" }
];

// Business Status options
const BUSINESS_STATUS_OPTIONS = [
  { value: "REGISTERED", label: "Registered" },
  { value: "UNREGISTERED", label: "Unregistered" },
  { value: "PENDING", label: "Pending" }
];

// Business Stage options
const BUSINESS_STAGE_OPTIONS = [
  { value: "SME", label: "SME" },
  { value: "STARTUP", label: "Start up" }
];

// Number of Employees options
const EMPLOYEES_OPTIONS = [
  { value: "LESS_THAN_10", label: "Less than 10" },
  { value: "BETWEEN_10_AND_50", label: "10-50" },
  { value: "BETWEEN_50_AND_100", label: "50-100" },
  { value: "BETWEEN_100_AND_500", label: "100-500" },
  { value: "BETWEEN_500_AND_1000", label: "500-1000" },
  { value: "OVER_1000", label: "Over 1000" }
];

// Reported Sales options
const REPORTED_SALES_OPTIONS = [
  { value: "LESS_THAN_1000000", label: "Less than ₦1,000,000" },
  { value: "1000000-10000000", label: "₦1,000,000 - ₦10,000,000" },
  { value: "10000000-50000000", label: "₦10,000,000 - ₦50,000,000" },
  { value: "50000000-100000000", label: "₦50,000,000 - ₦100,000,000" },
  { value: "MORE_THAN_100000000", label: "More than ₦100,000,000" }
];

interface BusinessData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  location: string;
  industry: string;
  yearEstablished: string | number;
  businessLegalEntity: string;
  description: string;
  interestedIn?: string;
  numOfEmployees?: string;
  assets?: string;
  reportedSales?: string;
  businessStage?: string;
  businessStatus?: string;
}

interface EditBusinessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Business data to populate the form
   */
  businessData: BusinessData;
  
  /**
   * Business ID for the API call
   */
  businessId: string;
  
  /**
   * Function to call when the form is submitted with updated data
   */
  onUpdate: (data: BusinessData) => void | Promise<void>;
}

/**
 * Modal for editing business information
 */
const EditBusinessModal: React.FC<EditBusinessModalProps> = ({ 
  isOpen, 
  onClose, 
  businessData,
  businessId,
  onUpdate 
}) => {
  const { editBusiness, editing, error: apiError, success } = useBusinessStore();
  
  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    location: "",
    industry: "",
    yearEstablished: "",
    businessLegalEntity: "SOLE_PROPRIETORSHIP",
    description: "",
    // Optional fields are initialized as undefined
    interestedIn: undefined,
    numOfEmployees: undefined,
    assets: undefined,
    reportedSales: undefined,
    businessStage: undefined,
    businessStatus: undefined
  });
  
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Update form data when businessData changes (e.g., when modal is opened with different business)
  useEffect(() => {
    if (businessData) {
      setFormData({
        ...businessData,
        // Ensure optional fields are not initialized with empty strings
        interestedIn: businessData.interestedIn || undefined,
        numOfEmployees: businessData.numOfEmployees || undefined,
        assets: businessData.assets || undefined,
        reportedSales: businessData.reportedSales || undefined,
        businessStage: businessData.businessStage || undefined,
        businessStatus: businessData.businessStatus || undefined
      });
    }
  }, [businessData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle empty strings for optional fields
    if (value === "" && 
        (name === "interestedIn" || 
         name === "numOfEmployees" || 
         name === "assets" || 
         name === "reportedSales" || 
         name === "businessStage" || 
         name === "businessStatus")) {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData[name as keyof BusinessData];
        return newData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    
    // Simple validation
    if (!formData.businessName || !formData.location || !formData.businessEmail) {
      setError(true);
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      setError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    
    try {
      // Call the onUpdate function with the form data
      await onUpdate(formData);
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message || "An error occurred while updating business details.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Business">
      {(error || apiError) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} className="text-red-500" />
          {errorMessage || apiError || "Please fill in all required fields."}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name*</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Business Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email Address*</label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="business@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number*</label>
            <input
              type="tel"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="+234 800 123 4567"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Lagos, Nigeria"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Business Status</label>
            <div className="relative">
              <select
                name="businessStatus"
                value={formData.businessStatus || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Select Business Status</option>
                {BUSINESS_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Industry*</label>
            <div className="relative">
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
                required
              >
                <option value="">Select Industry</option>
                {INDUSTRY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year Established*</label>
            <div className="relative">
              <input
                type="number"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ownership Type*</label>
            <div className="relative">
              <select
                name="businessLegalEntity"
                value={formData.businessLegalEntity}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
                required
              >
                <option value="">Select Ownership Type</option>
                {LEGAL_ENTITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Stage</label>
            <div className="relative">
              <select
                name="businessStage"
                value={formData.businessStage || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Select Business Stage</option>
                {BUSINESS_STAGE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Interested In</label>
            <div className="relative">
              <select
                name="interestedIn"
                value={formData.interestedIn || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Select Interest</option>
                {INTERESTED_IN_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Employees</label>
            <div className="relative">
              <select
                name="numOfEmployees"
                value={formData.numOfEmployees || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Select Number of Employees</option>
                {EMPLOYEES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reported Sales</label>
            <div className="relative">
              <select
                name="reportedSales"
                value={formData.reportedSales || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">Select Reported Sales</option>
                {REPORTED_SALES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assets</label>
            <input
              type="text"
              name="assets"
              value={formData.assets || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Business assets..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Business description..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
            disabled={editing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-mainGreen text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:bg-green-300"
            disabled={editing}
          >
            {editing ? "Updating..." : "Update Business"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBusinessModal;
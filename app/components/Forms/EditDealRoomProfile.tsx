import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Modal from "../Modal";
import { AlertCircle } from "lucide-react";
import { useBusinessStore } from "@/app/store/useBusinessStore";
import { EditBusinessDealRoomRPayload } from "@/app/types/payload";

interface DealRoomData {
  topSellingProducts: string[];
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: string;
  reportedYearlySales: string;
  profitMarginPercentage: number;
  assetsDetails: string[];
  valueOfPhysicalAssets: string;
  tentativeSellingPrice: string;
  reasonForSale: string;
}

interface EditDealRoomModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Deal Room data to populate the form
   */
  dealRoomData: DealRoomData | null;
  
  /**
   * Business ID for the API call
   */
  businessId: string;
  
  /**
   * Function to call when the form is submitted with updated data
   */
  onUpdate: (data: EditBusinessDealRoomRPayload) => void | Promise<void>;
}

/**
 * Modal for editing deal room profile information
 */
const EditDealRoomModal: React.FC<EditDealRoomModalProps> = ({ 
  isOpen, 
  onClose, 
  dealRoomData,
  businessId,
  onUpdate 
}) => {
  const { editDealRoomProfile, editingDealRoom, error: apiError } = useBusinessStore();
  
  const [formData, setFormData] = useState<DealRoomData>({
    topSellingProducts: [],
    highlightsOfBusiness: "",
    facilityDetails: "",
    fundingDetails: "",
    averageMonthlySales: "",
    reportedYearlySales: "",
    profitMarginPercentage: 0,
    assetsDetails: [],
    valueOfPhysicalAssets: "",
    tentativeSellingPrice: "",
    reasonForSale: ""
  });
  
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Temporary state for string inputs that need to be converted to arrays
  const [topSellingProductsStr, setTopSellingProductsStr] = useState<string>("");
  const [assetsDetailsStr, setAssetsDetailsStr] = useState<string>("");

  // Update form data when dealRoomData changes (e.g., when modal is opened with different business)
  useEffect(() => {
    if (dealRoomData) {
      setFormData({
        ...dealRoomData,
      });
      
      // Initialize string representations for array fields
      setTopSellingProductsStr(dealRoomData.topSellingProducts?.join(', ') || '');
      setAssetsDetailsStr(dealRoomData.assetsDetails?.join(', ') || '');
    }
  }, [dealRoomData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle special cases for array inputs
    if (name === 'topSellingProductsStr') {
      setTopSellingProductsStr(value);
    } else if (name === 'assetsDetailsStr') {
      setAssetsDetailsStr(value);
    } else if (name === 'profitMarginPercentage') {
      // Handle numeric input with validation
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 100) {
        setFormData((prev) => ({ ...prev, [name]: numberValue }));
      }
    } else {
      // Handle all other inputs
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    
    try {
      // Process string inputs into arrays
      const topSellingProducts = topSellingProductsStr
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
        
      const assetsDetails = assetsDetailsStr
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Log for debugging
      console.log("Preparing to send arrays:", {
        topSellingProducts,
        assetsDetails
      });
      
      // Prepare the payload with the correct format for API
      // Making sure to stringify the arrays
      const payload: EditBusinessDealRoomRPayload = {
        topSellingProducts: JSON.stringify(topSellingProducts) as any, // Using type assertion to satisfy TypeScript
        highlightsOfBusiness: formData.highlightsOfBusiness,
        facilityDetails: formData.facilityDetails,
        fundingDetails: formData.fundingDetails,
        averageMonthlySales: formData.averageMonthlySales,
        reportedYearlySales: formData.reportedYearlySales,
        profitMarginPercentage: Number(formData.profitMarginPercentage),
        assetsDetails: JSON.stringify(assetsDetails) as any, // Using type assertion to satisfy TypeScript
        valueOfPhysicalAssets: formData.valueOfPhysicalAssets,
        tentativeSellingPrice: formData.tentativeSellingPrice,
        reasonForSale: formData.reasonForSale
      };
      
      // Log the final payload for debugging
      console.log("Sending payload with stringified arrays:", payload);
      
      // Call the onUpdate function with the form data
      await onUpdate(payload);
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message || "An error occurred while updating deal room details.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Deal Room Profile">
      {(error || apiError) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} className="text-red-500" />
          {errorMessage || apiError || "Please fill in all required fields."}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Top Selling Products</label>
            <textarea
              name="topSellingProductsStr"
              value={topSellingProductsStr}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Product A, Product B, Product C"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">Enter products separated by commas</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Highlights of Business</label>
            <textarea
              name="highlightsOfBusiness"
              value={formData.highlightsOfBusiness}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Describe the key highlights of your business"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Facility Details</label>
            <textarea
              name="facilityDetails"
              value={formData.facilityDetails}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Describe your business facilities"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Funding Details</label>
            <textarea
              name="fundingDetails"
              value={formData.fundingDetails}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Describe your funding situation"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Average Monthly Sales</label>
            <input
              type="text"
              name="averageMonthlySales"
              value={formData.averageMonthlySales}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 450000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Reported Yearly Sales</label>
            <input
              type="text"
              name="reportedYearlySales"
              value={formData.reportedYearlySales}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 5400000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Profit Margin Percentage</label>
            <input
              type="number"
              name="profitMarginPercentage"
              value={formData.profitMarginPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 28"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Assets Details</label>
            <textarea
              name="assetsDetailsStr"
              value={assetsDetailsStr}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Asset A, Asset B, Asset C"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">Enter assets separated by commas</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Value of Physical Assets</label>
            <input
              type="text"
              name="valueOfPhysicalAssets"
              value={formData.valueOfPhysicalAssets}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 180000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tentative Selling Price</label>
            <input
              type="text"
              name="tentativeSellingPrice"
              value={formData.tentativeSellingPrice}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 450000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Reason for Sale</label>
            <textarea
              name="reasonForSale"
              value={formData.reasonForSale}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Explain why you're selling the business"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
            disabled={editingDealRoom}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-mainGreen text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:bg-green-300"
            disabled={editingDealRoom}
          >
            {editingDealRoom ? "Updating..." : "Update Deal Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDealRoomModal;
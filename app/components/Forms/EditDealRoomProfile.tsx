import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Modal from "../Modal";
import { AlertCircle, Plus, X } from "lucide-react";
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
  
  // Individual inputs for array items
  const [newProduct, setNewProduct] = useState<string>("");
  const [newAsset, setNewAsset] = useState<string>("");

  // Update form data when dealRoomData changes (e.g., when modal is opened with different business)
  useEffect(() => {
    if (dealRoomData) {
      setFormData({
        ...dealRoomData,
        // Ensure arrays are properly initialized
        topSellingProducts: dealRoomData.topSellingProducts || [],
        assetsDetails: dealRoomData.assetsDetails || []
      });
    }
  }, [dealRoomData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'newProduct') {
      setNewProduct(value);
    } else if (name === 'newAsset') {
      setNewAsset(value);
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

  // Add a new product to the list
  const addProduct = () => {
    if (newProduct.trim()) {
      setFormData(prev => ({
        ...prev,
        topSellingProducts: [...prev.topSellingProducts, newProduct.trim()]
      }));
      setNewProduct("");
    }
  };

  // Remove a product from the list
  const removeProduct = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      topSellingProducts: prev.topSellingProducts.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add a new asset to the list
  const addAsset = () => {
    if (newAsset.trim()) {
      setFormData(prev => ({
        ...prev,
        assetsDetails: [...prev.assetsDetails, newAsset.trim()]
      }));
      setNewAsset("");
    }
  };

  // Remove an asset from the list
  const removeAsset = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      assetsDetails: prev.assetsDetails.filter((_, index) => index !== indexToRemove)
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    
    try {
      // Prepare the payload with stringified array fields
      const payload: EditBusinessDealRoomRPayload = {
        // Stringify the arrays for the API
        topSellingProducts: JSON.stringify(formData.topSellingProducts) as any,
        highlightsOfBusiness: formData.highlightsOfBusiness,
        facilityDetails: formData.facilityDetails,
        fundingDetails: formData.fundingDetails,
        averageMonthlySales: formData.averageMonthlySales,
        reportedYearlySales: formData.reportedYearlySales,
        profitMarginPercentage: Number(formData.profitMarginPercentage),
        assetsDetails: JSON.stringify(formData.assetsDetails) as any,
        valueOfPhysicalAssets: formData.valueOfPhysicalAssets,
        tentativeSellingPrice: formData.tentativeSellingPrice,
        reasonForSale: formData.reasonForSale
      };
      
      // Log the payload for debugging
      console.log("Sending deal room update payload with stringified arrays:", payload);
      
      // Call the onUpdate function with the form data
      await onUpdate(payload);
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message || "An error occurred while updating deal room details.");
    }
  };

  // Add keyboard event handler for adding items with Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, addFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
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
          {/* Top Selling Products - as individual items */}
          <div>
            <label className="block text-sm font-medium mb-1">Top Selling Products</label>
            
            <div className="mb-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="newProduct"
                  value={newProduct}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, addProduct)}
                  className="flex-1 border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="Add a product"
                />
                <button
                  type="button"
                  onClick={addProduct}
                  className="px-3 py-2 bg-mainGreen text-white rounded-md hover:bg-green-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* List of added products */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{product}</span>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {formData.topSellingProducts.length === 0 && (
                <p className="text-xs text-gray-500">No products added yet</p>
              )}
            </div>
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
          
          {/* Assets Details - as individual items */}
          <div>
            <label className="block text-sm font-medium mb-1">Assets Details</label>
            
            <div className="mb-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="newAsset"
                  value={newAsset}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, addAsset)}
                  className="flex-1 border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="Add an asset"
                />
                <button
                  type="button"
                  onClick={addAsset}
                  className="px-3 py-2 bg-mainGreen text-white rounded-md hover:bg-green-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* List of added assets */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.assetsDetails.map((asset, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{asset}</span>
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {formData.assetsDetails.length === 0 && (
                <p className="text-xs text-gray-500">No assets added yet</p>
              )}
            </div>
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
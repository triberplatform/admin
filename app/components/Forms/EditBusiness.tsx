import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal from "../Modal";
import { AlertCircle, Calendar } from "lucide-react";

interface BusinessData {
  businessName: string;
  location: string;
  industry: string;
  established: string;
  ownershipType: string;
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
   * Function to call when the form is submitted with updated data
   */
  onUpdate: (data: BusinessData) => void;
}

/**
 * Modal for editing business information
 */
const EditBusinessModal: React.FC<EditBusinessModalProps> = ({ 
  isOpen, 
  onClose, 
  businessData, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState<BusinessData>(businessData || {
    businessName: "",
    location: "",
    industry: "",
    established: "",
    ownershipType: "Sole Proprietorship"
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple validation example
    if (!formData.businessName || !formData.location) {
      setError(true);
      return;
    }

    // Call the update function
    onUpdate(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Business">
      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} className="text-red-500" />
          Please fill in all required fields.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Okechukwu Agro Ventures"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Lagos, Nigeria."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Agriculture"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Established</label>
            <div className="relative">
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
                placeholder="10 Mar 2025"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ownership Type</label>
            <div className="relative">
              <select
                name="ownershipType"
                value={formData.ownershipType}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Limited Liability Company">Limited Liability Company</option>
                <option value="Corporation">Corporation</option>
                <option value="Cooperative">Cooperative</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-mainGreen text-white rounded-md text-sm font-medium hover:bg-green-600"
          >
            Update Business
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBusinessModal;
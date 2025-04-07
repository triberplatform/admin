import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal from "../Modal";
import { AlertCircle } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
}

interface EditUserModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * User data to populate the form
   */
  userData: UserData;
  
  /**
   * Function to call when the form is submitted with updated data
   */
  onUpdate: (data: UserData) => void;
}

/**
 * Modal for editing user information
 */
const EditUserModal: React.FC<EditUserModalProps> = ({ 
  isOpen, 
  onClose, 
  userData, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState<UserData>(userData || {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple validation example
    if (!formData.firstName || !formData.lastName) {
      setError(true);
      return;
    }

    // Call the update function
    onUpdate(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} className="text-red-500" />
          Something went wrong, try that again.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-600 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-600 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-600 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-600 text-sm focus:ring-2 focus:ring-green-500"
            />
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
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
          >
            Update User
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
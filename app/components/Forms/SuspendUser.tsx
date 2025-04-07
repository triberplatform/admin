import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal from "../Modal";

interface SuspendFormData {
  duration: string;
  reason: string;
}

interface SuspendUserModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the user submits the suspension form
   */
  onSuspend: (data: SuspendFormData) => void;
}

/**
 * Modal for suspending a user with duration selection and reason
 */
const SuspendUserModal: React.FC<SuspendUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuspend 
}) => {
  const [formData, setFormData] = useState<SuspendFormData>({
    duration: "",
    reason: "",
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSuspend(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend User">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <div className="relative">
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
              >
                <option value="" disabled>Select Suspension Duration</option>
                <option value="1">1 Week</option>
                <option value="2">2 Weeks</option>
                <option value="4">1 Month</option>
                <option value="12">3 Months</option>
                <option value="24">6 Months</option>
                <option value="52">1 Year</option>
                <option value="permanent">Permanent</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter Brief Reason for Suspension"
              className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
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
            Suspend User
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SuspendUserModal;
import React from "react";
import Modal from "../Modal";

interface UnsuspendBusinessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the user confirms unsuspension
   */
  onUnsuspend: () => void;
  
  /**
   * The name of the business being unsuspended
   */
  businessName?: string;
}

/**
 * Modal for confirming business unsuspension
 */
const UnsuspendBusinessModal: React.FC<UnsuspendBusinessModalProps> = ({
  isOpen,
  onClose,
  onUnsuspend,
  businessName = "this business"
}) => {
  const handleSubmit = () => {
    onUnsuspend();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unsuspend Business">
      <div className="py-4">
        <p className="text-center mb-6">
          Are you sure you want to unsuspend <span className="font-semibold">{businessName}</span>?
        </p>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
          >
            Unsuspend Business
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsuspendBusinessModal;
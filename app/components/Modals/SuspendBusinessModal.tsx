import React from "react";
import Modal from "../Modal";

interface SuspendBusinessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the user confirms suspension
   */
  onSuspend: () => void;
  
  /**
   * The name of the business being suspended
   */
  businessName?: string;
}

/**
 * Modal for confirming business suspension
 */
const SuspendBusinessModal: React.FC<SuspendBusinessModalProps> = ({
  isOpen,
  onClose,
  onSuspend,
  businessName = "this business"
}) => {
  const handleSubmit = () => {
    onSuspend();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend Business">
      <div className="py-4">
        <p className="text-center mb-6">
          Are you sure you want to suspend <span className="font-semibold">{businessName}</span>?
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
            className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
          >
            Suspend Business
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendBusinessModal;
import React from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../Modal";

interface SuspendBusinessFailureModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the retry button is clicked
   */
  onRetry: () => void;
}

/**
 * Displays an error message when business suspension fails
 */
const SuspendBusinessFailureModal: React.FC<SuspendBusinessFailureModalProps> = ({
  isOpen,
  onClose,
  onRetry
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend Business">
      <div className="flex items-center gap-2 text-red-500 mb-4">
        <div className="bg-red-100 p-2 rounded-full">
          <AlertCircle size={20} className="text-red-500" />
        </div>
        <span>Something went wrong, try that again.</span>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    </Modal>
  );
};

export default SuspendBusinessFailureModal;
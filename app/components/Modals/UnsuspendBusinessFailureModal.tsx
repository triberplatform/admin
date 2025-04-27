import React from "react";
import Modal from "../Modal";
import { AlertTriangle } from "lucide-react";

interface UnsuspendBusinessFailureModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Function to call when the user wants to retry
   */
  onRetry: () => void;
}

/**
 * Failure modal shown if unsuspending a business fails
 */
const UnsuspendBusinessFailureModal: React.FC<UnsuspendBusinessFailureModalProps> = ({
  isOpen,
  onClose,
  onRetry
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Error">
      <div className="flex flex-col items-center py-8">
        <div className="text-red-500 mb-4">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to Unsuspend Business
        </h3>
        <p className="text-center text-gray-500 mb-6">
          There was an error while trying to unsuspend this business. Please try again.
        </p>
        <div className="flex gap-3 w-full">
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
            Retry
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsuspendBusinessFailureModal;
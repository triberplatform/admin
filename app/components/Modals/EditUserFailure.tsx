import React from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../Modal";

interface EditUserFailureModalProps {
  isOpen: boolean;

  onClose: () => void;

  onRetry: () => void;
}

/**
 * Displays an error message when user editing fails
 */
const EditUserFailureModal: React.FC<EditUserFailureModalProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
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

export default EditUserFailureModal;

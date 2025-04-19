import React from "react";
import Modal from "../Modal";
import { CheckCircle } from "lucide-react";

interface UnsuspendUserSuccessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
}

/**
 * Success modal shown after a user is successfully unsuspended
 */
const UnsuspendUserSuccessModal: React.FC<UnsuspendUserSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Success">
      <div className="flex flex-col items-center py-8">
        <div className="text-green-500 mb-4">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User Unsuspended
        </h3>
        <p className="text-center text-gray-500 mb-6">
          The user has been successfully unsuspended and can now access their account.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default UnsuspendUserSuccessModal;
import React from "react";
import Modal from "../Modal";

interface UnsuspendUserModalProps {
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
   * The name of the user being unsuspended
   */
  userName?: string;
}

/**
 * Modal for confirming user unsuspension
 */
const UnsuspendUserModal: React.FC<UnsuspendUserModalProps> = ({
  isOpen,
  onClose,
  onUnsuspend,
  userName = "this user"
}) => {
  const handleSubmit = () => {
    onUnsuspend();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unsuspend User">
      <div className="py-4">
        <p className="text-center mb-6">
          Are you sure you want to unsuspend <span className="font-semibold">{userName}</span>?
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
            Unsuspend User
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsuspendUserModal;
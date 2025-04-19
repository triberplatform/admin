import React from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../Modal";

interface SuspendUserSuccessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * The duration of the suspension (can be a string like "permanent" or a number representing weeks)
   */
  duration?: string | number;
}

/**
 * Displays a success message after a user has been successfully suspended
 */
const SuspendUserSuccessModal: React.FC<SuspendUserSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  duration 
}) => {
  // Map numeric duration to text


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend User">
      <div className="flex items-center gap-2 text-green-600 mb-4">
        <CheckCircle size={20} />
        <span>User has been suspended</span>
      </div>
   
     
    </Modal>
  );
};

export default SuspendUserSuccessModal;
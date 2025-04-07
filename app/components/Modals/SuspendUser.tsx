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
  const getDurationText = (duration: string | number): string => {
    if (duration === "permanent") return "permanently";
    
    const weeks = typeof duration === "string" ? parseInt(duration) : duration;
    
    if (weeks === 1) return "for a duration of 1 Week";
    if (weeks === 4) return "for a duration of 1 Month";
    if (weeks === 12) return "for a duration of 3 Months";
    if (weeks === 24) return "for a duration of 6 Months";
    if (weeks === 52) return "for a duration of 1 Year";
    return `for a duration of ${weeks} Weeks`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend User">
      <div className="flex items-center gap-2 text-green-600 mb-4">
        <CheckCircle size={20} />
        <span>User has suspended {duration ? getDurationText(duration) : "successfully"}.</span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 font-medium">Reason</p>
        <p className="text-sm">User received a strike for providing false information.</p>
      </div>
     
    </Modal>
  );
};

export default SuspendUserSuccessModal;
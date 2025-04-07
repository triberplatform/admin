import React from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../Modal";

interface UpdateScoreSuccessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * The new fundability score value (as a percentage)
   */
  newScore: number;
  
  /**
   * The reason for the score update
   */
  reason: string;
}

/**
 * Displays a success message after fundability score has been successfully updated
 */
const UpdateScoreSuccessModal: React.FC<UpdateScoreSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  newScore,
  reason
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Fundability Score">
      <div className="flex items-center gap-2 text-green-600 mb-6">
        <CheckCircle size={20} className="text-green-500" />
        <span className="text-gray-700">Fundability Score has been updated to {newScore}%.</span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 font-medium">Reason</p>
        <p className="text-sm text-gray-800">{reason}</p>
      </div>
      
      <div className="mt-6">
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

export default UpdateScoreSuccessModal;
import React from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../Modal";

interface EditUserSuccessModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  text:string,
  title?:string
}

/**
 * Displays a success message after a user has been successfully updated
 */
const EditUserSuccessModal: React.FC<EditUserSuccessModalProps> = ({ 
  isOpen, 
  onClose ,
  text,
  title
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || ""}>
      <div className="flex items-center gap-2 text-mainGreen mb-4">
        <CheckCircle size={20} />
        <span> {text}</span>
      </div>
     
    </Modal>
  );
};

export default EditUserSuccessModal;
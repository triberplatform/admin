// components/Modals/VerifyBusinessSuccessModal.tsx
import React, { useEffect } from "react";

interface VerifyBusinessSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

const VerifyBusinessSuccessModal: React.FC<VerifyBusinessSuccessModalProps> = ({
  isOpen,
  onClose,
  businessName
}) => {
  // Auto-close after 3 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {/* Success checkmark */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Business Verified</h2>
          <p className="mb-4 text-gray-600">
            <span className="font-semibold">{businessName}</span> has been successfully verified.
          </p>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyBusinessSuccessModal;
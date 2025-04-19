// components/Modals/VerifyBusinessModal.tsx
import React from "react";

interface VerifyBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  businessName: string;
  isVerifying: boolean;
}

const VerifyBusinessModal: React.FC<VerifyBusinessModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  businessName,
  isVerifying
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Verify Business</h2>
        <p className="mb-6">
          Are you sure you want to verify <span className="font-semibold">{businessName}</span>? 
          This will mark the business as officially verified on the platform.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isVerifying}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isVerifying}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Business"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyBusinessModal;
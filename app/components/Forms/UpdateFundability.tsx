import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal from "../Modal";
import { AlertCircle } from "lucide-react";

interface ScoreUpdateData {
  newScore: string;
  reason: string;
}

interface UpdateFundabilityScoreModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Current score value
   */
  currentScore: number;
  
  /**
   * Function to call when the form is submitted with updated data
   */
  onUpdateScore: (data: ScoreUpdateData) => void;
}

/**
 * Modal for updating fundability score
 */
const UpdateFundabilityScoreModal: React.FC<UpdateFundabilityScoreModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  onUpdateScore
}) => {
  const [formData, setFormData] = useState<ScoreUpdateData>({
    newScore: currentScore.toString(),
    reason: "",
  });
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Reset form data when modal opens or currentScore changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        newScore: currentScore.toString(),
        reason: ""
      });
      setError(false);
      setErrorMessage("");
    }
  }, [isOpen, currentScore]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate score is a number between 0 and 100
    const scoreNum = Number(formData.newScore);
    if (!formData.newScore || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError(true);
      setErrorMessage("Score must be a number between 0 and 100");
      return;
    }
    
    // Validate reason is provided
    if (!formData.reason.trim()) {
      setError(true);
      setErrorMessage("Please provide a reason for this update");
      return;
    }
    
    // Call the update function
    onUpdateScore(formData);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Fundability Score">
      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} className="text-red-500" />
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Score</label>
            <input
              type="text"
              value={currentScore}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm bg-gray-100"
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Score</label>
            <input
              type="text"
              name="newScore"
              value={formData.newScore}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Enter New Score"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Enter Brief Reason for this update"
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-mainGreen text-white rounded-md text-sm font-medium hover:bg-green-600"
          >
            Update Score
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateFundabilityScoreModal;
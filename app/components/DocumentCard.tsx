'use client'
import React from 'react';

// Define Document interface
interface Document {
  id: string;
  title: string;
  fileType?: string;  // Optional with ? since we now handle undefined case
  fileSize: string;
  downloadUrl: string;
  date?: string;      // Optional date field
}

// Define props interface for the component
interface DocumentCardProps {
  document: Document;
  onClick?: (document: Document) => void; // Optional click handler
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  // Helper function to determine icon color based on file type
  const getIconColor = (fileType?: string): string => {
    // Check if fileType is defined
    if (!fileType) return "bg-gray-400"; // Default gray for undefined file types
    
    switch (fileType.toUpperCase()) {
      case "JPG":
      case "JPEG":
      case "PNG":
        return "bg-emerald-400"; // Green for image types
      case "XLS":
      case "XLSX":
      case "CSV":
        return "bg-green-500"; // Different green for spreadsheets
      case "DOC":
      case "DOCX":
        return "bg-blue-500"; // Blue for Word documents
      case "PPT":
      case "PPTX":
        return "bg-orange-500"; // Orange for presentations
      default:
        return "bg-red-400"; // Red for PDF and others
    }
  };

  // Handle click event for document
  const handleDocumentClick = () => {
    // If custom onClick handler is provided, use it
    if (onClick) {
      onClick(document);
      return;
    }
    
    // Default behavior
    console.log(`Document clicked: ${document.title}`);
    
    // If there's a download URL, you can use it like this:
    // window.open(document.downloadUrl, '_blank');
  };

  return (
    <div 
      className="bg-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleDocumentClick}
    >
      <div className="mb-6 flex justify-center">
        <div className="relative w-20 h-24 bg-white rounded shadow">
          <div className="p-4">
            <div className="w-12 h-2 bg-gray-300 mb-3"></div>
            <div className="w-12 h-1 bg-gray-300"></div>
          </div>
          <div className={`absolute top-0 right-0 w-8 h-8 ${getIconColor(document.fileType)}`}></div>
        </div>
      </div>
      <h3 className="font-medium text-gray-900 mb-1 truncate">{document.title}</h3>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5z" />
          </svg>
          <span>{document.fileType || 'Unknown'}</span>
        </div>
        <span>{document.fileSize}</span>
      </div>
      
      {/* Optional date display if document has a date */}
      {document.date && (
        <div className="mt-2 text-xs text-gray-400">
          Added: {document.date}
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
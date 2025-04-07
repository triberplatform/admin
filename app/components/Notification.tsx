'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type NotificationType = 'error' | 'success' | 'warning' | 'info';

interface NotificationProps {
  /** The type of notification to display */
  type?: NotificationType;
  /** The message to display in the notification */
  message: string;
  /** Optional title for the notification */
  title?: string;
  /** Whether the notification is visible */
  isVisible?: boolean;
  /** Function to call when the notification is dismissed */
  onDismiss?: () => void;
  /** Auto dismiss duration in milliseconds (0 to disable) */
  autoDismiss?: number;
  /** Z-index for the notification */
  zIndex?: number;
  /** Position on the screen (only middle-right is implemented here) */
  position?: 'middle-right';
}

export default function ToastNotification({
  type = 'error',
  message,
  title,
  isVisible = true,
  onDismiss,
  autoDismiss = 0,
  zIndex = 50,
  position = 'middle-right',
}: NotificationProps) {
  // Auto dismiss functionality
  useEffect(() => {
    if (isVisible && autoDismiss > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismiss);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismiss, onDismiss]);

  if (!isVisible) return null;

  // Color and icon configurations based on type
  const typeStyles = {
    error: {
      containerClass: 'bg-red-50 border-red-200',
      iconClass: 'bg-red-100 text-red-500',
      textClass: 'text-red-700',
    },
    success: {
      containerClass: 'bg-green-50 border-green-200',
      iconClass: 'bg-green-100 text-green-500',
      textClass: 'text-green-700',
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'bg-yellow-100 text-yellow-500',
      textClass: 'text-yellow-700',
    },
    info: {
      containerClass: 'bg-blue-50 border-blue-200',
      iconClass: 'bg-blue-100 text-blue-500',
      textClass: 'text-blue-700',
    },
  };

  const { containerClass, iconClass, textClass } = typeStyles[type];

  // Position styles
  const positionStyles = {
    'middle-right': 'fixed right-4 top-1/2 -translate-y-1/2',
  };

  return (
    <>
      {/* Semi-transparent backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-10 ${zIndex ? `z-${zIndex - 10}` : 'z-40'}`}
        onClick={onDismiss}
      />
      
      {/* Notification toast */}
      <div 
        className={`${positionStyles[position]} max-w-sm w-full shadow-lg rounded-md animate-slide-in ${containerClass} ${zIndex ? `z-${zIndex}` : 'z-50'}`}
        role="alert"
      >
        <div className="flex items-start gap-3 p-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${iconClass} flex items-center justify-center`}>
            <X className="w-4 h-4" />
          </div>
          
          <div className="flex-grow">
            {title && <h4 className={`font-medium ${textClass}`}>{title}</h4>}
            <p className={`text-sm ${textClass}`}>{message}</p>
          </div>
          
          {onDismiss && (
            <button 
              type="button" 
              className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Add the animation styles */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

// Example Usage:
// 1. Basic Error Toast (like in the images)
/*
import { useState } from 'react';

export function MyComponent() {
  const [showError, setShowError] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowError(true)}>Show Error</button>
      
      <ToastNotification 
        message="Something went wrong, try that again." 
        isVisible={showError}
        onDismiss={() => setShowError(false)}
      />
    </div>
  );
}
*/

// 2. Success Toast with Auto Dismiss
/*
import { useState } from 'react';

export function UserForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form...
    setShowSuccess(true);
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form fields *//*}
        <button type="submit">Save</button>
      </form>
      
      <ToastNotification 
        type="success"
        message="User updated successfully!" 
        isVisible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        autoDismiss={5000} // Auto dismiss after 5 seconds
      />
    </div>
  );
}
*/
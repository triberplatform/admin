import React from "react";

export type StatusType = "Accepted" | "Pending Response" | "Rejected" | string; // Allow for custom status types

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

/**
 * Returns styling information for a given status
 */
export const getStatusStyles = (
  status: StatusType
): {
  bgColor: string;
  textColor: string;
  label: string;
} => {
  switch (status) {
    case "Accepted":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        label: "Funded",
      };
    case "Rejected":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        label: "Score Too Low",
      };
    case "Pending Response":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        label: "Pending Response",
      };
    default:
      // Default to gray for unknown statuses
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        label: status,
      };
  }
};

/**
 * A reusable status badge component
 */
export const StatusBadge2: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const { bgColor, textColor, label } = getStatusStyles(status);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor} ${className}`}
    >
      {label}
    </span>
  );
};

/**
 * Example usage:
 *
 * <StatusBadge status="Funded" />
 * <StatusBadge status="Awaiting Proposal" />
 *
 * // Or using the helper function directly
 * const { bgColor, textColor, label } = getStatusStyles('Pending Response');
 * <div className={`${bgColor} ${textColor}`}>{label}</div>
 */

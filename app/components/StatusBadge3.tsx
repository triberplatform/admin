import React from "react";

export type StatusType3 = "PENDING" | "ACCEPTED" | "REJECTED" | string; // Allow for custom status types

interface StatusBadge3Props {
  status: StatusType3;
  className?: string;
}

/**
 * Returns styling information for a given status
 */
export const getStatusStyles3 = (
  status: StatusType3
): {
  bgColor: string;
  textColor: string;
  label: string;
} => {
  // Convert status to uppercase for case-insensitive comparison
  const normalizedStatus = status?.toUpperCase() || "";
  
  switch (normalizedStatus) {
    case "ACCEPTED":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        label: "Accepted",
      };
    case "REJECTED":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        label: "Rejected",
      };
    case "PENDING":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        label: "Pending",
      };
    default:
      // Default to gray for unknown statuses
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        label: status || "Unknown",
      };
  }
};

/**
 * A reusable status badge component for business proposals
 */
export const StatusBadge3: React.FC<StatusBadge3Props> = ({
  status,
  className = "",
}) => {
  const { bgColor, textColor, label } = getStatusStyles3(status);

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
 * <StatusBadge3 status="PENDING" />
 * <StatusBadge3 status="ACCEPTED" />
 * <StatusBadge3 status="REJECTED" />
 *
 * // Or using the helper function directly
 * const { bgColor, textColor, label } = getStatusStyles3('PENDING');
 * <div className={`${bgColor} ${textColor}`}>{label}</div>
 */
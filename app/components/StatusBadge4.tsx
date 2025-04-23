import React from "react";

export type StatusType4 = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED" | string; // Allow for custom status types

interface StatusBadge4Props {
  status: StatusType4;
  className?: string;
}

/**
 * Returns styling information for a given status
 */
export const getStatusStyles4 = (
  status: StatusType4
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
    case "CANCELED":
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        label: "Canceled",
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
 * A reusable status badge component for investor proposals
 */
export const StatusBadge4: React.FC<StatusBadge4Props> = ({
  status,
  className = "",
}) => {
  const { bgColor, textColor, label } = getStatusStyles4(status);

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
 * <StatusBadge4 status="PENDING" />
 * <StatusBadge4 status="ACCEPTED" />
 * <StatusBadge4 status="REJECTED" />
 * <StatusBadge4 status="CANCELED" />
 *
 * // Or using the helper function directly
 * const { bgColor, textColor, label } = getStatusStyles4('PENDING');
 * <div className={`${bgColor} ${textColor}`}>{label}</div>
 */
'use client'
import Link from 'next/link';
import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  link?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className={`w-full border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }: TableProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', link }: TableRowProps) {
  const rowClass = `${link ? 'cursor-pointer' : ''} hover:bg-gray-50 ${className}`;
  
  // Instead of conditionally rendering different structures,
  // use an onClick handler for navigation
  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
  };
  
  return (
    <tr 
      className={rowClass} 
      onClick={handleClick}
      style={link ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`px-4 py-3 text-xs ${className}`}>
      {children}
    </td>
  );
}
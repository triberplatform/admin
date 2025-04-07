import React from 'react';

export interface InfoGridItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface InfoGridProps {
  items: InfoGridItem[];
  columns?: 1 | 2 | 3 | 4 | 6;
  className?: string;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ 
  items, 
  columns = 3, 
  className = ''
}) => {
  if (!items || !items.length) return null;

  const getColumnClass = () => {
    switch (columns) {
      case 1: return 'md:grid-cols-1';
      case 2: return 'md:grid-cols-2';
      case 3: return 'md:grid-cols-3';
      case 4: return 'md:grid-cols-4';
      case 6: return 'md:grid-cols-6';
      default: return 'md:grid-cols-3';
    }
  };

  return (
    <div className={`w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <div className={`grid grid-cols-1 gap-4 ${getColumnClass()}`}>
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm  text-gray-500">{item.label}</div>
            <div className="text-sm font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
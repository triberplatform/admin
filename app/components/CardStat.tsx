import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  viewAllLink: string;
  color?: string;
}

export default function StatCard({ 
  title, 
  count, 
  icon: Icon, 
  viewAllLink,
  color = 'indigo-500' 
}: StatCardProps) {
 ;

  const textColorClass ='text-mainPurple';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 text-sm font-medium">{title}</span>
        </div>
        <Link 
          href={viewAllLink}
          className="text-green-500 text-xs hover:font-bold"
        >
          View All
        </Link>
      </div>
      
      <div className="mt-5">
        <span className={`text-3xl font-semibold ${textColorClass}`}>
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
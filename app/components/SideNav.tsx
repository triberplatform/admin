'use client';

import React from 'react';
import { Menu, Grid, Users, Briefcase, TestTube, Handshake, Settings, HelpCircle, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: Grid },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Businesses', href: '/businesses', icon: Briefcase },
    { name: 'Fundability Tests', href: '/fundability-tests', icon: TestTube },
    { name: 'Deals', href: '/deals', icon: Handshake }
  ];

  const bottomNavItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Support', href: '/support', icon: HelpCircle },
    { name: 'Logout', href: '/logout', icon: LogOut }
  ];

  const isActive = (path: string) => {
    // Special case for home/root path
    if (path === '/') {
      // Only return true if pathname is exactly '/' (home page)
      return pathname === '/';
    }
    // For other paths, check if pathname starts with the path
    return pathname.startsWith(path);
  };
  return (
    <div className="w-[20%] bg-white h-screen fixed left-0 z-50 shadow-md flex flex-col">
      {/* Header with logo */}
      <div className="p-4 border-b">
        <div className="flex gap-5 items-center">
          <button className="mr-2">
            <Menu size={24} />
          </button>
          <Image src={'/logo.svg'} alt='logo' width={100} height={300}/>
        </div>
      </div>
      
      {/* Main navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`flex items-center text-sm p-2 font-semibold rounded ${
                    active 
                      ? 'bg-green-50 text-green-600' 
                      : 'text-mainGray hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${active ? 'text-green-600' : ''}`}>
                    <Icon size={18} />
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom navigation */}
      <div className="p-4 border-t">
        <ul className="space-y-2">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`flex items-center text-sm p-2 font-semibold rounded ${
                    active 
                      ? 'bg-green-50 text-green-600' 
                      : 'text-mainGray hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${active ? 'text-green-600' : ''}`}>
                    <Icon size={18} />
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
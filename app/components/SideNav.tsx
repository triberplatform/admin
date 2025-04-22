'use client';

import React, { useState } from 'react';
import { Menu, Grid, Users, Briefcase, TestTube, Handshake, Settings, HelpCircle, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore'; // Adjust the path to match your project structure

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Grid },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Businesses', href: '/dashboard/businesses', icon: Briefcase },
    { name: 'Investors', href: '/dashboard/investors', icon: Handshake },
    { name: 'Fundability Tests', href: '/dashboard/fundability-tests', icon: TestTube },
  ];

  const bottomNavItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  // Show logout confirmation dialog
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };
  
  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  
  // Confirm and proceed with logout
  const confirmLogout = () => {
    // Call the signout function from auth store
    signout();
    
    console.log('User logged out successfully');
    setShowLogoutConfirm(false);
    
    // Redirect to login page after logout
    router.push('/');
  };

  // Improved active link detection
  const isActive = (path: string) => {
    // For dashboard root
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    
    // For nested routes (excluding exact dashboard match handled above)
    if (path.startsWith('/dashboard/') && pathname.startsWith(path)) {
      return true;
    }
    
    // For settings and support pages - exact match
    if ((path === '/settings' || path === '/support') && pathname === path) {
      return true;
    }
    
    return false;
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
          
          {/* Logout button - separate from map to handle click event */}
          <li>
            <button 
              onClick={handleLogoutClick}
              className="flex w-full items-center text-sm p-2 font-semibold rounded text-mainGray hover:bg-gray-100"
            >
              <span className="mr-3">
                <LogOut size={18} />
              </span>
              Logout
            </button>
          </li>
        </ul>
      </div>
      
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelLogout}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
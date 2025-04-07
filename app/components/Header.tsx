import { Bell, Moon, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <header className="bg-white  py-3  flex items-center justify-between">
    {/* Search Bar */}
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-white w-full py-2 pl-10 pr-4 border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none"
        placeholder="Search"
      />
    </div>

    {/* Right Side Icons */}
    <div className="flex items-center space-x-6">
      {/* Theme Toggle */}
      <button className="text-gray-500">
        <Moon className="h-7 w-7" />
      </button>

      {/* Notification Bell */}
      <div className="relative">
        <Bell className="h-7 w-7 text-gray-500" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </div>

      {/* User Avatar */}
      <div className="h-8 w-8 rounded-full overflow-hidden">
        <Image
          src="/icon.svg"
          alt="User"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
    </div>
  </header>
  )
}

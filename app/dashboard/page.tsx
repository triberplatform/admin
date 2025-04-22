'use client'
import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Clock,
  Calendar
} from "lucide-react";

import StatCard from "../components/CardStat";
import Header from "../components/Header";
import { useUserStore } from "../store/useUserStore";

export default function Home() {
  // Get state and actions from the user store
  const { 
    dataCount, 
    loading, 
    error, 
    getDashboard 
  } = useUserStore();

  // Current date for welcome message
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    getDashboard();
    
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [getDashboard]);
  
  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Format date
  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(currentTime);
  };

  return (
    <div className="px-6 ml-[20%]">
      <Header/>
      
      {/* Welcome Section */}
      <div className="mt-6 bg-mainGreen/20 p-6 rounded-lg shadow-sm border border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}, Admin</h1>
            <p className="text-gray-600 mt-1">
              <Clock size={16} className="inline mr-1" />
              {formatDate()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-sm">
            <Calendar size={20} className="text-indigo-500" />
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">
          Welcome to your dashboard. Here&apos;s an overview of your platform.
        </p>
      </div>
      
      {/* Main Stats Overview */}
      <div className="mt-8 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg text-gray-800">Overview</h2>
          <div className="text-sm text-gray-500">
            <Clock size={16} className="inline mr-1" />
            Last updated: {currentTime.toLocaleTimeString()}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 py-6 px-4 rounded-lg border border-red-200 flex items-center justify-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              {error}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              title="Users"
              count={dataCount?.usersCount || 0}
              icon={Users}
              viewAllLink="/dashboard/users"
              color="indigo-500"
            />

            <StatCard
              title="Businesses"
              count={dataCount?.businessesCount || 0}
              icon={Briefcase}
              viewAllLink="/dashboard/businesses"
              color="blue-500"
            />

            <StatCard
              title="Investors"
              count={dataCount?.investorsCount || 0}
              icon={Briefcase}
              viewAllLink="/dashboard/investors"
              color="purple-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
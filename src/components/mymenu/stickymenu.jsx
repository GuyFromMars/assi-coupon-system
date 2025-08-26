"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, Search, Settings, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function StickyFooter() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleThemeChange);
    return () => darkModeQuery.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <>
      <footer className={`fixed bottom-0 left-0 right-0 shadow-lg border-t z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-around items-center h-16 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/dashboard/add-coupon">
            <Button variant="ghost" className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
              <PlusCircle className="h-6 w-6" />
              <span className="text-xs">Add Coupon</span>
            </Button>
          </Link>
          <Link href="/dashboard/query">
            <Button variant="ghost" className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
              <Search className="h-6 w-6" />
              <span className="text-xs">Query</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            <Filter className="h-6 w-6" />
            <span className="text-xs">Filter</span>
          </Button>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
              <Settings className="h-6 w-6" />
              <span className="text-xs">Settings</span>
            </Button>
          </Link>
        </div>
      </footer>
    </>
  );
}
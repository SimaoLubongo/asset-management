"use client"

import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { ChevronDown } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ModeToggle />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="text-sm font-medium">Account</span>
              <ChevronDown size={16} />
            </button>
            
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                  Your Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                  Settings
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                  Sign out
                </a>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className='text-black'>SL</AvatarFallback>
            </Avatar>

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
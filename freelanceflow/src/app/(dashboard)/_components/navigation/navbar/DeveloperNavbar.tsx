"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Layout, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

export const DeveloperNavbar = () => {
  const pathname = usePathname();
  const { logout, isLoading } = useLogout();

  return (
    <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo et titre */}
            <div className="flex items-center gap-3 mr-8">
              <Layout className="h-6 w-6 text-[#FF4405]" />
              <span className="text-lg font-semibold">FreelanceFlow</span>
            </div>

            {/* Navigation */}
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  href="/mission"
                  className={`flex items-center gap-2 transition-colors ${pathname === '/missions'
                    ? 'text-[#FF4405]'
                    : 'text-gray-300 hover:text-[#FF4405]'
                    }`}
                >
                  <FolderKanban className="h-5 w-5" />
                  <span>Mes missions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Bouton de déconnexion */}
          <div className="flex items-center">
            <button
              onClick={logout}
              disabled={isLoading}
              className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors 
                                       bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>{isLoading ? 'Déconnexion...' : 'Déconnexion'}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
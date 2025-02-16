"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Layout, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export const DeveloperNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const NavItems = () => (
    <>
      <li>
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 transition-colors ${pathname === '/dashboard'
            ? 'text-[#FF4405]'
            : 'text-gray-300 hover:text-[#FF4405]'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link
          href="/mission"
          className={`flex items-center gap-2 transition-colors ${pathname === '/missions'
            ? 'text-[#FF4405]'
            : 'text-gray-300 hover:text-[#FF4405]'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FolderKanban className="h-5 w-5" />
          <span>Mes missions</span>
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo et titre */}
            <div className="flex items-center gap-3 mr-8">
              <Layout className="h-6 w-6 text-[#FF4405]" />
              <span className="text-lg font-semibold">FreelanceFlow</span>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center space-x-8">
              <NavItems />
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-[#FF4405] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col space-y-4 py-4">
              <NavItems />
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
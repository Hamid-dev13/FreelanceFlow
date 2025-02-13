"use client";

import React, { type ReactNode } from 'react';
import { DeveloperNavbar } from '@/app/(dashboard)/_components/navigation/navbar/DeveloperNavbar';

type DeveloperLayoutProps = {
    children: ReactNode;
};

export const DeveloperLayout = ({ children }: DeveloperLayoutProps) => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <DeveloperNavbar />
            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};
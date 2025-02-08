import React from 'react';

interface GradientTextProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export function GradientText({ children, variant = 'primary', className = '' }: GradientTextProps) {
    const gradients = {
        primary: "bg-gradient-to-r from-[#FF4405] to-[#FF5D26]",
        secondary: "bg-gradient-to-r from-[#FF4405] via-[#FF5D26] to-[#FF4405]"
    };

    const baseClasses = "text-transparent bg-clip-text";
    const combinedClasses = `${baseClasses} ${gradients[variant]} ${className}`;

    return (
        <span className={combinedClasses}>
            {children}
        </span>
    );
}
// src/components/common/ui/GradientText.tsx
import React, { ReactNode } from 'react';

interface GradientTextProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'secondary' | 'accent';  // Ajout de 'accent'
}

export const GradientText: React.FC<GradientTextProps> = ({
    children,
    className = '',
    variant = 'default'
}) => {
    const gradients = {
        default: 'from-[#FF4405] to-[#F8B810]',
        primary: 'from-[#FF4405] to-[#F8B810]',
        secondary: 'from-[#7928CA] to-[#FF0080]',
        accent: 'from-[#FF4405] to-[#F8B810]'    // Ajout du gradient pour accent
    };

    return (
        <span
            className={`bg-gradient-to-r ${gradients[variant]} bg-clip-text text-transparent ${className}`}
        >
            {children}
        </span>
    );
};

export type { GradientTextProps };
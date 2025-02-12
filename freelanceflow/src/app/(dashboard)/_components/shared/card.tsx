// _components/shared/card.tsx
import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="rounded-lg shadow p-4">
            {children}
        </div>
    );
};
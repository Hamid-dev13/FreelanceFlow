import React from 'react';

export const DeveloperLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>Dashboard</li>
                        <li>Mes tâches</li>
                        <li>Suivi des bugs</li>
                        <li>Codebase</li>
                        {/* Ajoute d'autres liens spécifiques au développeur */}
                    </ul>
                </nav>
            </header>

        </div>
    );
};

import React from 'react';

export const ProjectManagerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>Dashboard</li>
                        <li>Gestion des projets</li>
                        <li>Équipes</li>
                        <li>Rapports</li>
                        {/* Ajoute d'autres liens spécifiques au chef de projet */}
                    </ul>
                </nav>
            </header>
            <main>
                {children} {/* Affiche le contenu de la page */}
            </main>
        </div>
    );
};

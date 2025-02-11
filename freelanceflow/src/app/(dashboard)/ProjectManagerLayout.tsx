import React from 'react';

export const ProjectManagerLayout = () => {  // Plus besoin du props children
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>Dashboard</li>
                        <li>Gestion des projets</li>
                        <li>Équipes</li>
                        <li>Rapports</li>
                    </ul>
                </nav>
            </header>
            <main>
                {/* Contenu spécifique au ProjectManager */}
                <h1>Dashboard Chef de Projet</h1>
                {/* ... */}
            </main>
        </div>
    );
};


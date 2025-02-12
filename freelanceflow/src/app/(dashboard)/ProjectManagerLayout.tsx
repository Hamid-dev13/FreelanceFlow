import React from 'react';
import AddMissionButton from '../components/mission/AddMissionButton';
export const ProjectManagerLayout = () => {  // Plus besoin du props children
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>Dashboard</li>
                        <li>Gestion des projets</li>
                        <AddMissionButton onClick={() => console.log('Bouton cliqué')} />
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


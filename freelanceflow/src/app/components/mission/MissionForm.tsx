import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { createMission } from '@/services/missionService';

interface Developer {
    id: string;
    name: string;
}

interface MissionFormProps {
    onClose: () => void;
    onSubmit: (missionData: any) => void;
}

const MissionForm: React.FC<MissionFormProps> = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [developers, setDevelopers] = useState<Developer[]>([]);

    useEffect(() => {
        // TODO: Remplacer par un appel API réel pour obtenir la liste des développeurs
        setDevelopers([
            { id: '1', name: 'Dev 1' },
            { id: '2', name: 'Dev 2' },
            { id: '3', name: 'Dev 3' },
        ]);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newMission = await createMission({
                title,
                description,
                deadline,
                // Envoyez null si aucun développeur n'est sélectionné
                assignedToId: assignedToId || null
            });
            onSubmit(newMission);
            onClose(); // Fermer le formulaire après la soumission réussie
        } catch (error) {
            console.error("Erreur lors de la création de la mission:", error);
            // TODO: Afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la mission"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la mission"
                required
            />
            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
            />
            <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
            // Suppression de l'attribut required
            >
                <option value="">Aucun développeur assigné</option>
                {developers.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
            </select>
            <Button type="submit" variant="primary">Créer la mission</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
        </form>
    );
};

export default MissionForm;
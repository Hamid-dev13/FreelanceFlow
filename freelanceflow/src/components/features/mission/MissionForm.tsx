import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';

interface Developer {
    id: string;
    name: string;
}

interface MissionFormProps {
    onClose: () => void;
    onSubmit: (missionData: CreateMissionData) => void;
}

const MissionForm: React.FC<MissionFormProps> = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedToId, setAssignedToId] = useState('');  // Changé de assignedTo à assignedToId
    const [developers, setDevelopers] = useState<Developer[]>([]);

    useEffect(() => {
        // TODO: Remplacer par un appel API réel
        setDevelopers([
            { id: '1', name: 'Dev 1' },
            { id: '2', name: 'Dev 2' },
            { id: '3', name: 'Dev 3' },
        ]);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const missionData: CreateMissionData = {
                title,
                description,
                deadline,
                assignedToId: assignedToId || undefined  // Utilisation du bon nom de propriété
            };

            onSubmit(missionData);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la création de la mission:", error);
        }
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const modal = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
            <div className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-800 shadow-xl" onClick={handleModalClick}>
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Nouvelle Mission</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Titre
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white placeholder-gray-400"
                            placeholder="Titre de la mission"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white placeholder-gray-400 min-h-[100px]"
                            placeholder="Description détaillée de la mission"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
                            Date limite
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="developer" className="block text-sm font-medium text-gray-300">
                            Développeur assigné
                        </label>
                        <select
                            id="developer"
                            value={assignedToId}  // Changé de assignedTo à assignedToId
                            onChange={(e) => setAssignedToId(e.target.value)}  // Changé ici aussi
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white"
                        >
                            <option value="">Sélectionner un développeur</option>
                            {developers.map(dev => (
                                <option key={dev.id} value={dev.id}>{dev.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#FF4405] text-white rounded-lg hover:bg-[#e63d04] transition-all duration-300 shadow-lg hover:shadow-[#FF4405]/20"
                        >
                            Créer la mission
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default MissionForm;
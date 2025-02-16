import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useMissionStore, type CreateMissionData } from '@/stores/useMissionStore';

interface Developer {
    id: string;
    name: string;
    email: string;
    role: 'DEVELOPER' | 'PROJECT_MANAGER';
}

interface Project {
    id: string;
    title: string;
    description?: string;
    status: string;
    client: {
        id: string;
        name: string;
        email: string;
    };
}

interface MissionFormProps {
    onClose: () => void;
    onSubmit: (missionData: CreateMissionData) => void;
    onProjectSelect?: (project: Project | null) => void;
}

const MissionForm: React.FC<MissionFormProps> = ({ onClose, onSubmit, onProjectSelect }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users?role=DEVELOPER', {
                    method: 'GET',
                    credentials: 'include', // Utilisation des cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Impossible de récupérer les développeurs');
                }

                const data: Developer[] = await response.json();
                setDevelopers(data);
                setError(null);
            } catch (err) {
                console.error("Erreur de récupération des développeurs:", err);
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
                setDevelopers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopers();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                const response = await fetch('/api/projects', {
                    method: 'GET',
                    credentials: 'include', // Utilisation des cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Impossible de récupérer les projets');
                }

                const data: Project[] = await response.json();
                setProjects(data);
                setProjectsError(null);
            } catch (err) {
                console.error("Erreur de récupération des projets:", err);
                setProjectsError(err instanceof Error ? err.message : 'Une erreur est survenue');
                setProjects([]);
            } finally {
                setProjectsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setProjectId(selectedId);

        // Trouver et transmettre le projet sélectionné au parent
        const selectedProject = selectedId
            ? projects.find(p => p.id === selectedId) || null
            : null;
        onProjectSelect?.(selectedProject);
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const missionData: CreateMissionData = {
                title,
                description,
                deadline,
                assignedToId: assignedToId || null,
                projectId: projectId || null
            };

            onSubmit(missionData);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la création de la mission:", error);
        }
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
                        <label htmlFor="project" className="block text-sm font-medium text-gray-300">
                            Projet associé
                        </label>
                        {projectsLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-[#FF4405]" />
                            </div>
                        ) : projectsError ? (
                            <div className="text-red-500 bg-red-500/10 p-3 rounded-lg">
                                {projectsError}
                            </div>
                        ) : (
                            <select
                                id="project"
                                value={projectId}
                                onChange={handleProjectChange}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white"
                            >
                                <option value="">Sélectionner un projet</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.title} - {project.client.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="developer" className="block text-sm font-medium text-gray-300">
                            Développeur assigné
                        </label>
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-[#FF4405]" />
                            </div>
                        ) : error ? (
                            <div className="text-red-500 bg-red-500/10 p-3 rounded-lg">
                                {error}
                            </div>
                        ) : (
                            <select
                                id="developer"
                                value={assignedToId}
                                onChange={(e) => setAssignedToId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF4405] focus:border-transparent text-white"
                            >
                                <option value="">Sélectionner un développeur</option>
                                {developers.map(dev => (
                                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                                ))}
                            </select>
                        )}
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
                            disabled={loading || !!error}
                            className="px-4 py-2 bg-[#FF4405] text-white rounded-lg hover:bg-[#e63d04] transition-all duration-300 shadow-lg hover:shadow-[#FF4405]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Créer la mission
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
};

export default MissionForm;
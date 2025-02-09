import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description?: string;
    clientId: string;
    startDate: string;
    endDate?: string;
    status: string;
};

type Client = {
    id: string;
    name: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project: Project | null;
};

export default function EditProjectModal({ isOpen, onClose, onSuccess, project }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        clientId: project?.clientId || "",
        startDate: project?.startDate || "",
        endDate: project?.endDate || "",
        status: project?.status || "EN_COURS"
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description || "",
                clientId: project.clientId,
                startDate: project.startDate.split('T')[0],
                endDate: project.endDate?.split('T')[0] || "",
                status: project.status
            });
        }
    }, [project]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/clients", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            } else {
                setError("Erreur lors du chargement des clients");
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de connexion au serveur");
        }
    };

    const handleClose = () => {
        setError(null);
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/projects/${project?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    startDate: new Date(formData.startDate).toISOString(),
                    endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
                })
            });

            if (res.ok) {
                onSuccess();
                handleClose();
            } else {
                const errorData = await res.json();
                setError(errorData.error || "Une erreur est survenue lors de la modification du projet");
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de connexion au serveur");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Modifier Projet</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center text-red-400">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Titre</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Client</label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={isSubmitting}
                            >
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Date de début</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Date de fin</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINE">Terminé</option>
                                <option value="EN_PAUSE">En pause</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm text-white bg-gradient-to-r from-primary to-secondary rounded-lg shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Modification...
                                    </>
                                ) : (
                                    'Mettre à jour'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
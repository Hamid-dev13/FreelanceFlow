import { X, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    clientName: string;
};

export default function DeleteClientModal({
    isOpen,
    onClose,
    onConfirm,
    clientName
}: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setError(null);
        setIsDeleting(false);
        onClose();
    };

    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        setError(null);

        try {
            await onConfirm();
            handleClose();
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de la suppression du client");
            setIsDeleting(false);
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
                        <h3 className="text-lg font-semibold text-white">Supprimer Client</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeleting}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="mb-4 bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center text-red-400">
                                <AlertCircle className="mr-2 h-5 w-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <p className="text-gray-300">
                            Êtes-vous sûr de vouloir supprimer le client
                            <span className="font-bold"> {clientName}</span> ?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isDeleting}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm text-white bg-secondary hover:bg-secondary-light rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Suppression...
                                    </>
                                ) : (
                                    'Supprimer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
// components/ui/DeleteClientModal.tsx
"use client";

import { X } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    clientName: string;
};

export default function DeleteClientModal({
    isOpen,
    onClose,
    onConfirm,
    clientName
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Supprimer Client</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <p className="text-gray-300">
                            Êtes-vous sûr de vouloir supprimer le client
                            <span className="font-bold"> {clientName}</span> ?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm text-white bg-secondary hover:bg-secondary-light rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

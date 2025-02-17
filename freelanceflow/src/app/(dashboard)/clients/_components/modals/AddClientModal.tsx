import React, { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const PHONE_PREFIXES = [
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Allemagne' },
    { code: '+44', country: 'Royaume-Uni' },
    { code: '+1', country: 'États-Unis/Canada' },
    { code: '+32', country: 'Belgique' },
    { code: '+41', country: 'Suisse' },
    { code: '+352', country: 'Luxembourg' }
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;  // Ajout de cette prop manquante
};

export default function AddClientModal({ isOpen, onClose }: Props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        phonePrefix: "+33"
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        server?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePhone = (phone: string, prefix: string) => {
        try {
            const fullPhone = `${prefix}${phone}`;
            const isValid = isValidPhoneNumber(fullPhone);
            console.log(`Validation du numéro de téléphone: ${fullPhone} -> ${isValid}`);
            return isValid;
        } catch (error) {
            console.error("Erreur lors de la validation du numéro de téléphone:", error);
            return false;
        }
    };

    const handleClose = () => {
        console.log("Fermeture du modal, réinitialisation des données du formulaire.");
        setFormData({
            name: "",
            email: "",
            phone: "",
            phonePrefix: "+33"
        });
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return; // Empêche les soumissions multiples

        console.log("Formulaire soumis avec les données :", formData);
        const newErrors: typeof errors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (formData.phone.trim() &&
            !validatePhone(formData.phone.replace(/\s/g, ''), formData.phonePrefix)) {
            newErrors.phone = "Numéro de téléphone invalide";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log("Erreurs de validation détectées :", newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                credentials: 'include', // Important pour envoyer les cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone ? `${formData.phonePrefix}${formData.phone.replace(/\s/g, '')}` : undefined
                }),
            });

            console.log("Réponse du serveur:", res.status, res.ok);
            if (res.ok) {
                handleClose();
                console.log("Client ajouté avec succès.");
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.error || "Une erreur est survenue lors de l'ajout du client";
                setErrors({
                    server: errorMessage
                });
                console.error("Erreur du serveur:", errorMessage);
                setIsSubmitting(false);
            }
        } catch (err) {
            const errorMessage = "Erreur de connexion au serveur";
            console.error("Erreur de connexion:", err);
            setErrors({
                server: errorMessage
            });
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl border border-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Nouveau Client</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            disabled={isSubmitting}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {errors.server && (
                        <div className="mb-4 bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center text-red-400">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            <span>{errors.server}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Nom</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    setErrors({ ...errors, name: undefined });
                                }}
                                className={`mt-1 block w-full rounded-lg bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary`}
                                disabled={isSubmitting}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    setErrors({ ...errors, email: undefined });
                                }}
                                className={`mt-1 block w-full rounded-lg bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary`}
                                disabled={isSubmitting}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Téléphone</label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.phonePrefix}
                                    onChange={(e) => {
                                        setFormData({ ...formData, phonePrefix: e.target.value });
                                        setErrors({ ...errors, phone: undefined });
                                    }}
                                    className="w-1/3 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-white"
                                    disabled={isSubmitting}
                                >
                                    {PHONE_PREFIXES.map((prefix) => (
                                        <option key={prefix.code} value={prefix.code}>
                                            {prefix.code} ({prefix.country})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        setFormData({ ...formData, phone: e.target.value });
                                        setErrors({ ...errors, phone: undefined });
                                    }}
                                    placeholder="Numéro de téléphone"
                                    className={`flex-1 block w-full rounded-lg bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Ajout en cours...
                                    </>
                                ) : (
                                    'Ajouter'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
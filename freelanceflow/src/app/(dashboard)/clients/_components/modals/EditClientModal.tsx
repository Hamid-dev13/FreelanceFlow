import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
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

type Client = {
    id: string;
    name: string;
    email: string;
    phone?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    client: Client | null;
};

export default function EditClientModal({ isOpen, onClose, onSuccess, client }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    useEffect(() => {
        if (client) {
            const phonePrefix = client.phone
                ? PHONE_PREFIXES.find(p => client.phone?.startsWith(p.code))?.code || '+33'
                : '+33';
            const phoneNumber = client.phone
                ? client.phone.replace(phonePrefix, '')
                : '';

            setFormData({
                name: client.name,
                email: client.email,
                phone: phoneNumber,
                phonePrefix: phonePrefix
            });
        }
    }, [client]);

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePhone = (phone: string, prefix: string) => {
        if (!phone) return true;
        try {
            const fullPhone = `${prefix}${phone}`;
            return isValidPhoneNumber(fullPhone);
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

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
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/clients/${client?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone ? `${formData.phonePrefix}${formData.phone.replace(/\s/g, '')}` : undefined
                })
            });

            if (res.ok) {
                onSuccess();
                handleClose();
            } else {
                const errorData = await res.json();
                setErrors({
                    server: errorData.error || "Une erreur est survenue lors de la modification du client"
                });
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            setErrors({
                server: "Erreur de connexion au serveur"
            });
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl border border-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Modifier Client</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className={`mt-1 block w-full rounded-lg bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                                required
                                disabled={isSubmitting}
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
                                className={`mt-1 block w-full rounded-lg bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                                required
                                disabled={isSubmitting}
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
                                    className="w-1/3 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className={`flex-1 block w-full rounded-lg bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
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
                                    'Sauvegarder'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
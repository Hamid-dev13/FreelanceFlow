import { useState } from 'react';
import { validateEmail, validatePhone } from '@/app/(dashboard)/clients/_components/utils/validation';
import type { ClientFormData, ClientFormErrors } from '../types';

const DEFAULT_FORM_DATA: ClientFormData = {
    name: "",
    email: "",
    phone: "",
    phonePrefix: "+33"
};

export const useClientForm = (onSuccess: () => Promise<void>, onClose: () => void) => {
    const [formData, setFormData] = useState<ClientFormData>(DEFAULT_FORM_DATA);
    const [errors, setErrors] = useState<ClientFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): ClientFormErrors => {
        const newErrors: ClientFormErrors = {};

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

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone ? `${formData.phonePrefix}${formData.phone.replace(/\s/g, '')}` : undefined
                }),
            });

            if (res.ok) {
                await onSuccess();
                handleClose();
            } else {
                const errorData = await res.json();
                setErrors({
                    server: errorData.error || "Une erreur est survenue lors de l'ajout du client"
                });
            }
        } catch (err) {
            setErrors({
                server: "Erreur de connexion au serveur"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(DEFAULT_FORM_DATA);
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const updateField = (field: keyof ClientFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleSubmit,
        handleClose,
        updateField
    };
};
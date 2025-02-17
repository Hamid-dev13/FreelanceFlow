// src/app/(dashboard)/clients/_components/utils/validation.ts
import { isValidPhoneNumber } from 'libphonenumber-js';

export const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

export const validatePhone = (phone: string, prefix: string) => {
    try {
        const fullPhone = `${prefix}${phone}`;
        return isValidPhoneNumber(fullPhone);
    } catch (error) {
        console.error("Erreur lors de la validation du numéro de téléphone:", error);
        return false;
    }
};
// src/app/(dashboard)/clients/_components/types/index.ts
export interface ClientFormData {
    name: string;
    email: string;
    phone: string;
    phonePrefix: string;
}

export interface ClientFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    server?: string;
}

export interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}
'use client';

import { ForgotPasswordForm } from '@/app/components/ui/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Mot de passe oublié
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Entrez votre email pour réinitialiser votre mot de passe
                    </p>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
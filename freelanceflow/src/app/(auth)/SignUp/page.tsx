"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, ArrowLeft, Zap } from 'lucide-react';
import Image from 'next/image';
import '../styles/theme.css';
import { Button } from '../Stylecomponents/Button';
import { GradientText } from '@/app/Stylecomponents/GradientText';



export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Ajoutons d'abord la validation et l'indicateur de force
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        errors: [] as string[]
    });
    // Modifions handleChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(validatePassword(value));
        }
    };

    // Fonction de validation
    function validatePassword(password: string) {
        const errors: string[] = [];
        let score = 0;

        if (password.length >= 8) score++;
        else errors.push("Au moins 8 caractères");

        if (/[A-Z]/.test(password)) score++;
        else errors.push("Au moins une majuscule");

        if (/[0-9]/.test(password)) score++;
        else errors.push("Au moins un chiffre");

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        else errors.push("Au moins un caractère spécial");

        return { score, errors };
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        // Ajout de cette vérification
        if (passwordStrength.score < 4) {
            setError("Le mot de passe doit respecter tous les critères de sécurité");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login");
            } else {
                setError(data.error || "Erreur lors de l'inscription");
            }
        } catch (error) {
            setError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2 text-white">
                                <Zap className="h-8 w-8 text-[#FF4405]" />
                                <span className="text-xl font-bold">Freelanceflow</span>
                            </Link>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex min-h-screen">
                {/* Left side - Sign Up form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-8">
                            <GradientText>Créez votre compte</GradientText> Freelanceflow
                        </h2>

                        {error && (
                            <div className="mb-6 bg-[#FF4405]/10 border-l-4 border-[#FF4405] p-4 rounded-r-lg">
                                <p className="text-[#FF4405]">{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Nom complet
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405] transition-all duration-200"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405] transition-all duration-200"
                                        placeholder="vous@exemple.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405] transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                    {formData.password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex gap-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full ${i < passwordStrength.score
                                                            ? 'bg-[#FF4405]'
                                                            : 'bg-gray-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            {passwordStrength.errors.length > 0 && (
                                                <ul className="text-sm text-gray-400 space-y-1">
                                                    {passwordStrength.errors.map((error, i) => (
                                                        <li key={i} className="flex items-center gap-1">
                                                            <span className="h-1 w-1 rounded-full bg-gray-500" />
                                                            {error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                    Confirmer le mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405] transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="mt-1 text-sm text-[#FF4405]">
                                            Les mots de passe ne correspondent pas
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Création du compte...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        <span>Créer un compte</span>
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-black text-gray-400">Déjà inscrit ?</span>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 font-medium text-[#FF4405] hover:text-[#FF5D26] transition-colors duration-200"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Se connecter</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                        alt="Analytics Dashboard"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
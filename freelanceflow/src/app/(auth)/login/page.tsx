"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, Loader2, ArrowLeft, Zap } from 'lucide-react';
import Image from 'next/image';
import '../styles/theme.css';
import { Button } from '../../components/ui/Button';
import { GradientText } from '../Stylecomponents/GradientText';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                // Toujours rediriger vers /dashboard
                router.push('/dashboard');
                // Le layout s'occupera d'afficher la bonne interface selon le rôle
            } else {
                setError(data.error || "Erreur de connexion");
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
                                <GradientText className="text-xl font-bold">Freelanceflow</GradientText>
                            </Link>
                        </div>
                        <Button
                            variant="primary"
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
                {/* Left side - Login form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-8">
                            <GradientText>Connectez-vous</GradientText> à votre compte
                        </h2>

                        {error && (
                            <div className="mb-6 bg-[#7928CA]/10 border-l-4 border-[#7928CA] p-4 rounded-r-lg">
                                <p className="text-[#8A3DD9]">{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405] transition-all duration-200"
                                        placeholder="••••••••"
                                    />
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
                                        <span>Connexion...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        <span>Se connecter</span>
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
                                    <span className="px-2 bg-black text-gray-400">Pas encore inscrit ?</span>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/SignUp"
                                    className="inline-flex items-center gap-2 font-medium text-[#FF4405] hover:text-[#FF5D26] transition-colors duration-200"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Créer un compte</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
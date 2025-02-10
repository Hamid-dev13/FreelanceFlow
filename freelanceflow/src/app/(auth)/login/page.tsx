"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, Loader2, ArrowLeft, Zap } from 'lucide-react';
import Image from 'next/image';
import '../styles/theme.css';
import { Button } from '../Stylecomponents/Button';
import { GradientText } from '../Stylecomponents/GradientText';
import { jwtDecode } from 'jwt-decode';

// Définition de l'interface pour le token décodé
interface CustomJwtPayload {
    role: string;
    email: string;
    // Ajoute d'autres propriétés si nécessaire
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

                // Décoder le token avec l'interface définie
                const decodedToken = jwtDecode<CustomJwtPayload>(data.token);

                console.log("Utilisateur connecté:", decodedToken);

                if (decodedToken.role === "CHEF_PROJET") {
                    router.push("/Chief");
                } else {
                    router.push("/dashboard");
                }
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

            <div className="flex min-h-screen">
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
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405]"
                                    placeholder="vous@exemple.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#FF4405] focus:border-[#FF4405]"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
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

                        <div className="mt-6 text-center">
                            <Link href="/SignUp" className="text-[#FF4405] hover:text-[#FF5D26]">
                                <UserPlus className="h-4 w-4" /> Créer un compte
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2070&q=80"
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
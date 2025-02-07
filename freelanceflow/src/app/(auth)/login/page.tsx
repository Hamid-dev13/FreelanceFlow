"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/logo";
import { LogIn, UserPlus, Loader2 } from 'lucide-react';


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
                router.push("/dashboard");
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
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute inset-y-0 right-1/2 w-1/3 bg-gradient-to-r from-transparent to-white blur-3xl" />
                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-transparent to-white blur-3xl" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">

                <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
                    Connectez-vous à votre compte
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 text-gray-700">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="vous@exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1 text-gray-700">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Pas encore inscrit ?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a
                                href="/signup"
                                className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Créer un compte</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
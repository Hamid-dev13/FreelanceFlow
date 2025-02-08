"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Shield, CheckCircle } from 'lucide-react';
import { Button } from './Stylecomponents/Button';
import { FeatureCard } from './Stylecomponents/FeatureCard';
import { GradientText } from './Stylecomponents/GradientText';
import './styles/theme.css';

export default function LandingPage() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <GradientText>
            <span className="text-xl font-bold">Freelanceflow</span>
          </GradientText>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">À propos</a>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartClick}
          >
            Commencer
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Gérez vos projets freelance avec{' '}
              <GradientText variant="accent">simplicité</GradientText>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Une plateforme intuitive pour gérer vos clients, projets et factures en toute simplicité.
              Concentrez-vous sur ce qui compte vraiment : votre travail.
            </p>
            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={handleStartClick}
              >
                Commencer Gratuitement
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button variant="outline">Voir la Démo</Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-dark to-secondary rounded-2xl blur-2xl opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              alt="Dashboard"
              className="relative rounded-2xl shadow-2xl border border-gray-800"
            />
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-xl rounded-full border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-300">Rejoignez la communauté</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900/50 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-xl text-gray-400">Des outils puissants pour gérer votre activité freelance</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Simple et Rapide"
              description="Interface intuitive pour une gestion efficace de vos projets"
            />
            <FeatureCard
              icon={Shield}
              title="Sécurisé"
              description="Vos données sont protégées avec les meilleurs standards de sécurité"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Tout-en-un"
              description="Gérez clients, projets et factures au même endroit"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Rejoignez la communauté des freelances qui gèrent leur activité efficacement
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mx-auto"
            onClick={handleStartClick}
          >
            Commencer Maintenant
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
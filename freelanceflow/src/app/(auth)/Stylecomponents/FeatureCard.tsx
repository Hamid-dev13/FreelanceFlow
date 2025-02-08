import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: typeof LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="group relative p-8 bg-gray-900 rounded-2xl">
            {/* Conteneur de la bordure animée */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {/* Bordure qui se déplace comme un serpent */}
                <div className="absolute left-0 top-0 w-[2px] h-[200%] group-hover:-translate-y-1/2 transition-transform duration-700 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent" />
                </div>
            </div>

            {/* Contenu */}
            <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
                    <Icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary-light" />
                </div>

                <h3 className="mb-3 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary-light group-hover:to-secondary-light">{title}</h3>

                <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{description}</p>
            </div>
        </div>
    );
}
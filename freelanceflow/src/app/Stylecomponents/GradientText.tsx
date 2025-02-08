interface GradientTextProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
}

export function GradientText({ children, variant = 'primary' }: GradientTextProps) {
    const gradients = {
        primary: "from-primary to-secondary",
        secondary: "from-secondary to-accent",
        accent: "from-primary via-secondary to-accent"
    };

    return (
        <span className={`bg-gradient-to-r ${gradients[variant]} text-transparent bg-clip-text`}>
            {children}
        </span>
    );
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
    const baseStyles = "rounded-lg transition-all flex items-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-light hover:to-secondary-light shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)]",
        secondary: "bg-gradient-to-r from-secondary to-accent text-white hover:from-secondary-light hover:to-accent-light",
        outline: "text-gray-300 hover:text-white border border-gray-800 hover:bg-gray-800"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
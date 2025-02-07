// src/constants/theme.ts
export const colors = {
    primary: {
        light: '#60A5FA', // blue-400
        main: '#2563EB',  // blue-600
        dark: '#1D4ED8',  // blue-700
    },
    secondary: {
        light: '#A5B4FC', // indigo-400
        main: '#6366F1',  // indigo-500
        dark: '#4F46E5',  // indigo-600
    },
    background: {
        light: '#F9FAFB', // gray-50
        main: '#F3F4F6',  // gray-100
        dark: '#E5E7EB',  // gray-200
    }
};

export const animations = {
    transition: 'all 0.2s ease-in-out',
    hover: 'transform hover:scale-105 transition-all duration-200',
    slideIn: 'animate-slide-in-right',
};
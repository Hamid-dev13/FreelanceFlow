export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <svg
                className="w-8 h-8 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 5v14M5 12h14" />
                <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FreelanceFlow
            </span>
        </div>
    );
}
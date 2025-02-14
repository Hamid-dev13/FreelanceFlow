import { Layout } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4 text-[#FF4405]">
                <Layout className="h-12 w-12 animate-pulse" />
                <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base animate-pulse">Chargement du tableau de bord...</span>
                </div>
            </div>
        </div>
    );
}
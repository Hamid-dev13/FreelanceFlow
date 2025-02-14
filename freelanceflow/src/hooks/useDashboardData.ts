import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

type UserRole = 'DEVELOPER' | 'PROJECT_MANAGER';
type TokenPayload = { role: UserRole };




export function useDashboardData() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token) as TokenPayload;
            console.log("Role extrait du token:", decoded.role); // Ajout de log
            setRole(decoded.role);
        } catch (error) {
            console.error("Erreur de décodage du token:", error);
            localStorage.removeItem("token");
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    return { role, loading };
}
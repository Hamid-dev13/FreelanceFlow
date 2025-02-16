import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/features/auth/services/jwt'

export async function middleware(request: NextRequest) {
    console.log("🔵 Middleware démarré pour:", request.nextUrl.pathname);

    // Ignorer les routes d'authentification
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        console.log("⏭️ Route d'auth, skip middleware");
        return NextResponse.next();
    }

    try {
        // D'abord essayer de récupérer le token du cookie
        const tokenFromCookie = request.cookies.get('auth-token')?.value;
        console.log("🍪 Token depuis cookie:", tokenFromCookie ? "présent" : "absent");

        // Ensuite vérifier le header Authorization
        const authHeader = request.headers.get('Authorization');
        console.log("🔑 Authorization header:", authHeader ? "présent" : "absent");

        // Récupérer le token soit du cookie, soit du header
        let token = tokenFromCookie;
        if (!token && authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log("🔄 Utilisation du token depuis le header Bearer");
        }

        if (!token) {
            console.log("❌ Aucun token trouvé");
            return NextResponse.json(
                { error: 'Authentification requise' },
                { status: 401 }
            );
        }

        // Vérifier le token
        const payload = await verifyJWT(token);
        console.log("✅ Token vérifié pour l'utilisateur:", payload.email);

        // Ajouter les informations utilisateur aux headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);
        requestHeaders.set('x-user-email', payload.email);
        requestHeaders.set('x-user-role', payload.role);

        // Continuer avec les headers mis à jour
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error("❌ Erreur middleware:", error);
        return NextResponse.json(
            {
                error: 'Session invalide',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: ['/api/:path*']
}
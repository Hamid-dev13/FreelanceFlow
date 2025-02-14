import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT, JWTPayload, AccessTokenPayload } from '@/features/auth/services/jwt'

// Fonction de type guard
function isAccessTokenPayload(payload: JWTPayload): payload is AccessTokenPayload {
    return payload.type === 'access';
}

export async function middleware(request: NextRequest) {
    // Vérifie si l'URL commence par /api/auth/
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    // Récupère le header Authorization et le rôle stocké
    const authHeader = request.headers.get('Authorization')
    const storedRole = request.cookies.get('user_role')?.value

    console.log("🔍 Authorization header complet:", authHeader);
    console.log("🕵️ Rôle stocké:", storedRole);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Authentification requise' },
            { status: 401 }
        )
    }

    // Extraire le token avec un espace
    const token = authHeader.replace('Bearer ', '')
    console.log("🔑 Token extrait:", token);

    try {
        // Vérifier la validité du token
        const payload = await verifyJWT(token)

        console.log("✅ Payload décodé:", payload);

        // Vérifier si c'est un token d'accès
        if (!isAccessTokenPayload(payload)) {
            return NextResponse.json(
                { error: 'Token invalide - Nécessite un token d\'accès' },
                { status: 401 }
            )
        }

        // Vérifier la cohérence du rôle
        if (storedRole && payload.role !== storedRole) {
            console.warn("⚠️ Incohérence de rôle détectée");
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Ajouter les informations utilisateur dans les headers
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId)
        requestHeaders.set('x-user-email', payload.email)
        requestHeaders.set('x-user-role', payload.role)

        // Passer à l'étape suivante
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    } catch (error) {
        console.error("❌ Erreur de vérification du token:", error);
        return NextResponse.json(
            {
                error: 'Token invalide',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 401 }
        )
    }
}

export const config = {
    matcher: ['/api/:path*']
}
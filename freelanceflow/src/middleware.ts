import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/features/auth/services/jwt'

export async function middleware(request: NextRequest) {
    // Vérifie si l'URL commence par /api/auth/
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    // Récupère le header Authorization
    const authHeader = request.headers.get('Authorization')

    console.log("🔍 Authorization header complet:", authHeader);

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
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
    // Si l'URL commence par /api/auth/, on autorise la requête sans vérifier le token
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    // Récupérer le header d'authentification
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Authentification requise' },
            { status: 401 }
        )
    }

    // Extraire le token du header
    const token = authHeader.split(' ')[1]

    // Vérifier la validité du token
    const payload = await verifyJWT(token)

    if (!payload) {
        return NextResponse.json(
            { error: 'Token invalide' },
            { status: 401 }
        )
    }

    // Ajouter les informations utilisateur au header de la requête
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)

    // Passer à l'étape suivante avec les nouveaux headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/api/:path*']
}

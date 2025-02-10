import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
    // Vérifie si l'URL commence par /api/auth/
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    // Récupère le header Authorization
    const authHeader = request.headers.get('Authorization')

    // Log de l'Authorization header
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Authentification requise' },
            { status: 401 }
        )
    }

    // Extraire le token du header
    const token = authHeader.split(' ')[1]
    console.log("Token extrait:", token);

    // Vérifier la validité du token
    const payload = await verifyJWT(token)

    // Log du payload après la vérification du token
    console.log("Payload du token:", payload);

    if (!payload) {
        return NextResponse.json(
            { error: 'Token invalide' },
            { status: 401 }
        )
    }

    // Ajouter les informations utilisateur dans les headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)

    // Ajout du rôle dans les headers
    requestHeaders.set('x-user-role', payload.role) // Nouvelle ligne pour le rôle

    // Log des nouveaux headers
    console.log("Nouveaux headers:", requestHeaders);

    // Routes spécifiques aux rôles (nouvelle section)
    const path = request.nextUrl.pathname
    const userRole = payload.role

    // Ajout de validation des routes par rôle
    if (path.startsWith('/api/chef-de-projet') && userRole !== 'CHEF_PROJET') {
        return NextResponse.json(
            { error: 'Accès non autorisé' },
            { status: 403 }
        )
    }

    if (path.startsWith('/api/freelance') && userRole !== 'FREELANCE') {
        return NextResponse.json(
            { error: 'Accès non autorisé' },
            { status: 403 }
        )
    }

    // Passer à l'étape suivante
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/api/:path*']
}
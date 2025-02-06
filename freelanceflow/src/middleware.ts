import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Authentification requise' },
            { status: 401 }
        )
    }

    const token = authHeader.split(' ')[1]
    const payload = await verifyJWT(token)

    if (!payload) {
        return NextResponse.json(
            { error: 'Token invalide' },
            { status: 401 }
        )
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/api/:path*']
}
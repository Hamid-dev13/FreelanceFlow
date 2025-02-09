// src/lib/auth/jwt.ts
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

// Définissez une interface pour le payload
interface JWTPayload {
    userId: string;
    email: string;
    type?: 'password_reset' | string; // Type littéral ou string générique
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            type: payload.type as JWTPayload['type']
        };
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

export async function signJWT(payload: JWTPayload) {
    const jwt = await new jose.SignJWT({
        userId: payload.userId,
        email: payload.email,
        ...(payload.type && { type: payload.type }) // Utilisation conditionnelle
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

    return jwt;
}
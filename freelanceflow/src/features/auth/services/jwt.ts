// src/features/auth/services/jwt.ts
import * as jose from 'jose'

// Interface de base pour tous les tokens
interface BaseJWTPayload extends jose.JWTPayload {
    userId: string;
    type: 'access' | 'refresh';
}

// Interface pour l'access token
export interface AccessTokenPayload extends BaseJWTPayload {
    type: 'access';
    email: string;
    role: 'DEVELOPER' | 'PROJECT_MANAGER';
}

// Interface pour le refresh token
interface RefreshTokenPayload extends BaseJWTPayload {
    type: 'refresh';
}

// Type union pour export
export type JWTPayload = AccessTokenPayload | RefreshTokenPayload;

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)

export async function verifyJWT(token: string): Promise<JWTPayload> {
    console.log("🔍 Étapes de débogage JWT")
    console.log("🔐 Token reçu:", token)
    console.log("🔢 Longueur du token:", token.length)

    try {
        // Tenter de reconstruire un JWT valide si nécessaire
        let validToken = token

        const { payload } = await jose.jwtVerify(validToken, JWT_SECRET)

        console.log("✅ Payload décodé:", payload)

        // Type guard pour s'assurer que le payload a les propriétés attendues
        const isRefreshToken = (p: unknown): p is RefreshTokenPayload =>
            typeof p === 'object' && p !== null &&
            'userId' in p && 'type' in p && (p as any).type === 'refresh';

        const isAccessToken = (p: unknown): p is AccessTokenPayload =>
            typeof p === 'object' && p !== null &&
            'userId' in p && 'email' in p && 'role' in p &&
            (p as any).type === 'access';

        // Validation différente selon le type de token
        if (isRefreshToken(payload)) {
            return {
                type: 'refresh',
                userId: payload.userId,
            } as RefreshTokenPayload;
        } else if (isAccessToken(payload)) {
            return {
                type: 'access',
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            } as AccessTokenPayload;
        } else {
            throw new Error('Type de token non reconnu ou incomplet');
        }
    } catch (error) {
        console.error('🚨 Erreur complète de vérification:', error)

        // Log détaillé de l'erreur
        if (error instanceof Error) {
            console.error('Nom de l\'erreur:', error.name)
            console.error('Message de l\'erreur:', error.message)
            console.error('Stack de l\'erreur:', error.stack)
        }

        throw error
    }
}

export async function signJWT(payload: JWTPayload, expirationTime: string | number) {
    if (!payload || !expirationTime) {
        throw new Error('Payload et expirationTime sont requis');
    }

    try {
        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(expirationTime)
            .sign(JWT_SECRET);

        return jwt;
    } catch (error) {
        console.error('🚨 Erreur lors de la signature du JWT:', error);
        throw error;
    }
}
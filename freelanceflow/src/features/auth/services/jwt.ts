// src/features/auth/services/jwt.ts
import * as jose from 'jose'

export interface JWTPayload extends jose.JWTPayload {
    userId: string;
    email: string;
    role: 'DEVELOPER' | 'PROJECT_MANAGER';
    [key: string]: jose.JWTPayload[keyof jose.JWTPayload] | string | undefined;
}

// Création de la clé secrète une seule fois
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)

export async function verifyJWT(token: string): Promise<JWTPayload> {
    if (!token) {
        throw new Error('Token manquant');
    }

    try {
        // Vérification directe du token
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);

        // Validation du payload
        if (!payload.userId || !payload.email || !payload.role) {
            throw new Error('Payload JWT invalide: champs requis manquants');
        }

        // Vérification du type du rôle
        if (payload.role !== 'DEVELOPER' && payload.role !== 'PROJECT_MANAGER') {
            throw new Error('Rôle invalide dans le payload');
        }

        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            iat: payload.iat,
            exp: payload.exp,
            ...payload
        };
    } catch (error) {
        console.error('Erreur de vérification JWT:', error);
        throw new Error('Token invalide ou expiré');
    }
}

export async function signJWT(payload: JWTPayload): Promise<string> {
    try {
        // Vérification des champs requis avant la signature
        if (!payload.userId || !payload.email || !payload.role) {
            throw new Error('Payload incomplet pour la création du JWT');
        }

        const jwt = await new jose.SignJWT({
            ...payload,
            // Assurez-vous que ces champs sont des chaînes
            userId: String(payload.userId),
            email: String(payload.email),
            role: payload.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt() // Ajoute automatiquement iat
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        return jwt;
    } catch (error) {
        console.error('Erreur lors de la signature du JWT:', error);
        throw new Error('Impossible de créer le token');
    }
}
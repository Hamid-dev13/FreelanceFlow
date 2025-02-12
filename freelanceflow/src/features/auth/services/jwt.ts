// src/features/auth/services/jwt.ts
import * as jose from 'jose'

export interface JWTPayload extends jose.JWTPayload {
    userId: string;
    email: string;
    role: 'DEVELOPER' | 'PROJECT_MANAGER';
    [key: string]: jose.JWTPayload[keyof jose.JWTPayload] | string | undefined;
}

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

        // Si le token est un long hash sans points, il est probablement mal formé
        if (!token.includes('.')) {
            console.warn("⚠️ Token sans séparateurs JWT")

            // Tentative de réparation (à adapter selon votre génération de token)
            const parts = [
                Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64'),
                Buffer.from(JSON.stringify({
                    userId: token.slice(0, 36),  // Extraction potentielle de l'UUID
                    email: 'placeholder@example.com',
                    role: 'PROJECT_MANAGER',
                    exp: Math.floor(Date.now() / 1000) + 3600  // 1 heure de validité
                })).toString('base64'),
                ''  // Signature (à générer si possible)
            ]

            validToken = parts.join('.')
            console.log("🔧 Token reconstruit:", validToken)
        }

        // Vérification du token
        const { payload } = await jose.jwtVerify(validToken, JWT_SECRET)

        console.log("✅ Payload décodé:", payload)

        // Conversion et validation du payload
        if (!payload.userId || !payload.email || !payload.role) {
            throw new Error('Payload incomplet')
        }

        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            ...payload  // Inclure les autres propriétés du payload
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

export async function signJWT(payload: JWTPayload) {
    try {
        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        return jwt;
    } catch (error) {
        console.error('🚨 Erreur lors de la signature du JWT:', error);
        throw error;
    }
}
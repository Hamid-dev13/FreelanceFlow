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
);

export async function verifyJWT(token: string): Promise<JWTPayload> {
    console.log("🔹 Début de la vérification du JWT...");
    console.log("🔸 Token reçu:", token ? token.substring(0, 20) + "..." : "aucun token");

    if (!token) {
        console.error('❌ Token manquant');
        throw new Error('Token manquant');
    }

    try {
        // Nettoyer le token si nécessaire
        const cleanToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        console.log("🔹 Tentative de vérification du token nettoyé");

        const { payload } = await jose.jwtVerify(cleanToken, JWT_SECRET);
        console.log("✅ Token vérifié avec succès. Payload:", {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        });

        // Validation du payload
        if (!payload.userId || !payload.email || !payload.role) {
            console.error('❌ Payload JWT invalide: champs requis manquants');
            throw new Error('Payload JWT invalide: champs requis manquants');
        }

        // Vérification du type du rôle
        if (payload.role !== 'DEVELOPER' && payload.role !== 'PROJECT_MANAGER') {
            console.error('❌ Rôle invalide dans le payload:', payload.role);
            throw new Error('Rôle invalide dans le payload');
        }

        // Vérifier l'expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
            console.error('❌ Token expiré');
            throw new Error('Token expiré');
        }

        console.log("✅ Validation complète du payload réussie");
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            iat: payload.iat,
            exp: payload.exp,
            ...payload
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Erreur de vérification JWT:', error.message);
            if (error.message.includes('expired')) {
                throw new Error('Token expiré');
            }
        }
        throw new Error('Token invalide ou expiré');
    }
}

export async function signJWT(payload: JWTPayload): Promise<string> {
    console.log("🔹 Début de la création du JWT...");

    try {
        // Validation préalable du payload
        if (!payload.userId || !payload.email || !payload.role) {
            console.error('❌ Payload incomplet:', { payload });
            throw new Error('Payload incomplet pour la création du JWT');
        }

        // Nettoyer et valider les types
        const cleanPayload = {
            ...payload,
            userId: String(payload.userId).trim(),
            email: String(payload.email).trim(),
            role: payload.role
        };

        console.log("🔸 Payload nettoyé et validé:", cleanPayload);

        const jwt = await new jose.SignJWT(cleanPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        console.log("✅ Token généré avec succès");
        return jwt;
    } catch (error) {
        console.error('❌ Erreur lors de la signature du JWT:', error);
        if (error instanceof Error) {
            console.error('Détails:', error.message);
            throw error; // Propager l'erreur originale
        }
        throw new Error('Impossible de créer le token');
    }
}
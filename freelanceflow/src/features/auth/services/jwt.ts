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
    console.log("🔹 Début de la vérification du JWT...");

    if (!token) {
        console.error('❌ Token manquant');
        throw new Error('Token manquant');
    }

    try {
        console.log("🔹 Tentative de vérification du token...");
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);

        console.log("✅ Token vérifié avec succès. Payload : ", payload);

        // Validation du payload
        if (!payload.userId || !payload.email || !payload.role) {
            console.error('❌ Payload JWT invalide: champs requis manquants');
            throw new Error('Payload JWT invalide: champs requis manquants');
        }

        // Vérification du type du rôle
        if (payload.role !== 'DEVELOPER' && payload.role !== 'PROJECT_MANAGER') {
            console.error('❌ Rôle invalide dans le payload');
            throw new Error('Rôle invalide dans le payload');
        }

        console.log("✅ Payload valide, retour des informations.");
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as 'DEVELOPER' | 'PROJECT_MANAGER',
            iat: payload.iat,
            exp: payload.exp,
            ...payload
        };
    } catch (error) {
        console.error('❌ Erreur de vérification JWT:', error);
        throw new Error('Token invalide ou expiré');
    }
}

export async function signJWT(payload: JWTPayload): Promise<string> {
    console.log("🔹 Début de la création du JWT...");

    // Log du payload avant signature
    console.log("🔸 Payload à signer : ", payload);

    // Vérification des champs requis avant la signature
    if (!payload.userId || !payload.email || !payload.role) {
        console.error('❌ Payload incomplet pour la création du JWT');
        throw new Error('Payload incomplet pour la création du JWT');
    }

    // Vérification explicite des types
    if (typeof payload.userId !== 'string' || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
        console.error('❌ Les champs userId, email et role doivent être des chaînes de caractères');
        throw new Error('Les champs userId, email et role doivent être des chaînes de caractères');
    }

    try {
        console.log("🔹 Tentative de signature du JWT...");
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

        console.log("✅ Token généré avec succès.");
        return jwt;
    } catch (error) {
        console.error('❌ Erreur lors de la signature du JWT:', error);
        if (error instanceof Error) {
            console.error('Détails de l\'erreur:', error.message);
        }
        throw new Error('Impossible de créer le token');
    }
}

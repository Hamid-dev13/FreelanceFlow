import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            name: payload.name as string
        };
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
export async function signJWT(payload: { userId: string; email: string; name: string }) {
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

    return jwt;
}
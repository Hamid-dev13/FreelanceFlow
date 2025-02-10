// src/types/jose.d.ts
declare module 'jose' {
    export interface JWTPayload {
        userId?: string;
        email?: string;
        role?: string;
    }

    export function jwtVerify(
        token: string,
        secret: Uint8Array
    ): Promise<{ payload: JWTPayload; protectedHeader: any }>

    export class SignJWT {
        constructor(payload: Record<string, any>)
        setProtectedHeader(header: Record<string, any>): this
        setExpirationTime(time: string): this
        sign(secret: Uint8Array): Promise<string>
    }
}
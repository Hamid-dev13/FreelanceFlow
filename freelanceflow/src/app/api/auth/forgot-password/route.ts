// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { sendPasswordResetEmail } from "@/lib/auth/passwordResetService";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe
        const { data, error: userError } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !data) {
            return NextResponse.json({ error: "Aucun compte associé à cet email" }, { status: 404 });
        }

        // Envoyer l'email de réinitialisation
        await sendPasswordResetEmail(email);

        return NextResponse.json({
            message: "Email de réinitialisation envoyé"
        });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        return NextResponse.json(
            { error: "Erreur lors de l'envoi de l'email" },
            { status: 500 }
        );
    }
}


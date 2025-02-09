import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { signJWT, verifyJWT } from './jwt'; // Votre générateur de token existant
import { sendEmail } from '../email/transorter';

// Configuration Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Générer un token de réinitialisation de mot de passe
export async function generatePasswordResetToken(email: string) {
    // Rechercher l'utilisateur
    const { data, error } = await supabase
        .from('User')
        .select('id, email')
        .eq('email', email)
        .single();

    if (error || !data) {
        throw new Error('Utilisateur non trouvé');
    }

    // Générer un token JWT spécifique pour la réinitialisation
    const resetToken = await signJWT({
        userId: data.id,
        email: data.email,
        type: 'password_reset' // Champ supplémentaire pour identifier le type de token
    });

    return resetToken;
}

// Envoyer l'email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(email: string) {
    const resetToken = await generatePasswordResetToken(email);

    // URL de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser le mot de passe</a>
      <p>Ce lien expire dans 24 heures.</p>
    `
    });
}

// Réinitialiser le mot de passe
export async function resetPassword(token: string, newPassword: string) {
    try {
        // Vérifier le token
        const decoded = await verifyJWT(token);

        if (!decoded) {
            throw new Error('Token invalide');
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe dans Supabase
        const { error } = await supabase
            .from('User')
            .update({ password: hashedPassword })
            .eq('id', decoded.userId)
            .eq('email', decoded.email);

        if (error) {
            throw new Error('Impossible de mettre à jour le mot de passe');
        }

        return true;
    } catch (error) {
        console.error('Erreur de réinitialisation de mot de passe:', error);
        throw new Error('Impossible de réinitialiser le mot de passe');
    }
}
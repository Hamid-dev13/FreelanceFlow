import { Resend } from 'resend';

// Initialiser Resend avec votre clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer des emails
export async function sendEmail(options: {
    to: string,
    subject: string,
    html: string
}) {
    try {
        const result = await resend.emails.send({
            from: 'FreelanceFlow <noreply@votredomaine.com>', // Remplacez par votre domaine vérifié
            to: options.to,
            subject: options.subject,
            html: options.html
        });

        console.log('Email envoyé avec succès:', result);
        return result;
    } catch (error) {
        console.error('Erreur d\'envoi d\'email:', error);
        throw error;
    }
}
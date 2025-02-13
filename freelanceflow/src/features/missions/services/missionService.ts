// src/features/missions/services/missionService.ts 
export async function createMission(missionData: {
    title: string;
    description: string;
    deadline: string;
    assignedToId: string | null;
}) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/mission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(missionData),
        });

        console.log('Réponse de création de mission:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            try {
                // Cloner la réponse pour pouvoir la lire plusieurs fois
                const clonedResponse = response.clone();

                try {
                    const errorData = await response.json();
                    console.log('Données d\'erreur JSON:', errorData);
                    throw new Error(errorData.message || 'Erreur lors de la création de la mission');
                } catch (jsonError) {
                    console.log('Erreur de parsing JSON:', jsonError);

                    try {
                        const errorText = await clonedResponse.text();
                        console.log('Texte de la réponse:', errorText);
                        throw new Error(errorText || 'Erreur lors de la création de la mission');
                    } catch (textError) {
                        console.error('Erreur de lecture du texte:', textError);
                        throw new Error('Erreur inconnue lors de la création de la mission');
                    }
                }
            } catch (error) {
                console.error('Erreur complète:', error);
                throw error;
            }
        }

        return response.json();
    } catch (error) {
        console.error('Erreur de requête:', error);
        throw error;
    }
}
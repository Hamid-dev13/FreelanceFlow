// src/services/missionService.ts

export async function createMission(missionData: {
    title: string;
    description: string;
    deadline: string;
    assignedToId: string | null;
}) {
    const token = localStorage.getItem('token'); // Assurez-vous d'avoir le token stocké

    const response = await fetch('/api/mission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(missionData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la mission');
    }

    return response.json();
}
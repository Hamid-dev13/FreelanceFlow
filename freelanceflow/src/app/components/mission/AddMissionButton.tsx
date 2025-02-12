import React, { useState } from 'react';
import { Button } from '../ui/Button';
import MissionForm from './MissionForm';

interface AddMissionButtonProps {
    onMissionAdded?: (mission: any) => void;
}

const AddMissionButton: React.FC<AddMissionButtonProps> = ({ onMissionAdded }) => {
    const [showMissionForm, setShowMissionForm] = useState(false);

    const handleOpenMissionForm = () => {
        setShowMissionForm(true);
    };

    const handleCloseMissionForm = () => {
        setShowMissionForm(false);
    };

    const handleMissionSubmit = (missionData: any) => {
        // Si un callback onMissionAdded est fourni, l'appeler
        if (onMissionAdded) {
            onMissionAdded(missionData);
        }

        // Fermer le formulaire
        setShowMissionForm(false);
    };

    return (
        <>
            <Button
                onClick={handleOpenMissionForm}
                variant="primary"
                size="md"
            >
                Ajouter une mission
            </Button>

            {showMissionForm && (
                <MissionForm
                    onClose={handleCloseMissionForm}
                    onSubmit={handleMissionSubmit}
                />
            )}
        </>
    );
};

export default AddMissionButton;
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MissionForm from './MissionForm';

interface AddMissionButtonProps {
    onMissionAdded?: (missionData: any) => void;
    onClick?: () => void;  // Ajout de onClick comme prop optionnelle
}

const AddMissionButton: React.FC<AddMissionButtonProps> = ({ onMissionAdded, onClick }) => {
    const [showMissionForm, setShowMissionForm] = useState(false);

    const handleOpenMissionForm = () => {
        setShowMissionForm(true);
        onClick?.();  // Appel de onClick s'il existe
    };

    const handleCloseMissionForm = () => {
        setShowMissionForm(false);
    };

    const handleMissionSubmit = (missionData: any) => {
        if (onMissionAdded) {
            onMissionAdded(missionData);
        }
        setShowMissionForm(false);
    };

    return (
        <>
            <button
                onClick={handleOpenMissionForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4405] text-white rounded-lg hover:bg-[#e63d04] transition-all duration-300 shadow-lg hover:shadow-[#FF4405]/20"
            >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Mission</span>
            </button>

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
export type MissionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';

export interface Mission {
    id: string;
    title: string;
    description: string | null;
    status: MissionStatus;
    deadline: string | Date;
}
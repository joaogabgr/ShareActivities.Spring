export type UpdateActivities = {
    id: string;
    name: string;
    description: string;
    status: string;
    userId: string;
    type: string;
    dateExpire?: string | null;
    dateCreated: string;
    priority: string;
    daysForRecover: number;
    familyId: string;
}
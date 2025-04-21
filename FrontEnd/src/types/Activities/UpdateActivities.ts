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
    notes: string;
    location: string;
    latLog?: string | null;
    documentUrl?: string | null;
    photoUrl?: string | null;
    linkUrl?: string | null;
    documentName?: string | null;
    photoName?: string | null;
}
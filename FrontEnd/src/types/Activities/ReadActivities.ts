import { ActivitiesStatus } from "../../app/enum/ActivitiesStatus";

export type ReadActivities = {
    id: string;
    name: string;
    description: string;
    status: string;
    userName: string;
    date: string;
    priority: string;
    type: string;
    dateExpire: string;
    dayForRecover: string
    notes: string;
    location: string;
    latLog: string;
    documentUrl?: string;
    photoUrl?: string;
    linkUrl?: string;
    photoName?: string;
    documentName?: string;
};
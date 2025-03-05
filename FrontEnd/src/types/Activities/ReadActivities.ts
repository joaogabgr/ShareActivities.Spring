import { ActivitiesStatus } from "../../app/enum/ActivitiesStatus";

export type ReadActivities = {
    id: string;
    name: string;
    description: string;
    status: ActivitiesStatus;
    userName: string;
    date: string;
};
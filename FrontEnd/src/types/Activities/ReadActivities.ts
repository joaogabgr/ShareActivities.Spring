import { ActivitiesStatus } from "../../app/enum/ActivitiesStatus";

export type ReadActivities = {
    id: string;
    name: string;
    description: string;
    status: string;
    userName: string;
    date: string;
};
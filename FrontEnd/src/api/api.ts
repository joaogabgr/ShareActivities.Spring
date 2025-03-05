import axios from "axios";
import { CreateActivities } from "../types/Activities/CreateActivities";
import { UpdateActivities } from "../types/Activities/UpdateActivities";

export const api = axios.create({
    baseURL: "http://192.168.1.105:8080",
});

export const links = {
    readActivities: (id: string) => api.get("/activities/list/"+ id),

    deleteActivity: (id: string) => api.delete("/activities/delete/"+ id),

    createActivity: (data: CreateActivities) => api.post("/activities/create", data),

    updateActivity: (data: UpdateActivities) => api.put("/activities/update", data),

    updateActivityStatus: (id: string, status: string) => api.put("/activities/changeStatus", { id, status }),
}
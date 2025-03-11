import axios from "axios";
import { CreateActivities } from "../types/Activities/CreateActivities";
import { UpdateActivities } from "../types/Activities/UpdateActivities";
import { CreateFamilyDTO } from "../types/Family/CreateFamilyDTO";

export const api = axios.create({
    baseURL: "http:/192.168.1.103:8080",
});

export const links = {

    //#region ATIVIDADES
    readActivities: (id: string) => api.get("/activities/list/"+ id),

    deleteActivity: (id: string) => api.delete("/activities/delete/"+ id),

    createActivity: (data: CreateActivities) => api.post("/activities/create", data),

    updateActivity: (data: UpdateActivities) => api.put("/activities/update", data),

    updateActivityStatus: (id: string, status: string) => api.put("/activities/changeStatus", { id, status }),
    //#endregion
    
    //#region FAMILIA
    checkUserHaveFamily: (userEmail: string) => api.get("/families/checkUserHaveFamily/"+ userEmail),

    createFamily: (data: CreateFamilyDTO) => api.post("families/create", data)
    //#endregion
}
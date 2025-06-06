import axios, { AxiosError } from "axios";
import { CreateActivities } from "../types/Activities/CreateActivities";
import { UpdateActivities } from "../types/Activities/UpdateActivities";
import { CreateFamilyDTO } from "../types/Family/CreateFamilyDTO";
import { CreateFamilyRequest, InviteMemberRequest, UpdateFamilyRequest } from "../types/Family/Family";
import { ErrorAlertComponent } from "../app/components/Alerts/AlertComponent";

interface ErrorResponse {
    status: number;
    error: string;
}

// Configuração base da API
export const api = axios.create({
    baseURL: "http://192.168.1.107:8080",
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
        if (error.response) {
            // Erro com resposta do servidor
            const status = (error.response.data as any).status;
            const message = (error.response.data as any)?.error || 'Erro desconhecido';

            switch (status) {
                case 400:
                    ErrorAlertComponent("Erro de Validação", message);
                    break;
                case 401:
                    ErrorAlertComponent("Não Autorizado", "Sua sessão expirou. Por favor, faça login novamente.");
                    // Aqui você pode adicionar lógica para redirecionar para login
                    break;
                case 403:
                    ErrorAlertComponent("Acesso Negado", "Você não tem permissão para realizar esta ação.");
                    break;
                case 404:
                    ErrorAlertComponent("Não Encontrado", "O recurso solicitado não foi encontrado.");
                    break;
                case 500:
                    ErrorAlertComponent("Erro do Servidor", "Ocorreu um erro no servidor. Tente novamente mais tarde.");
                    break;
                default:
                    ErrorAlertComponent("Erro", message);
            }
        } else if (error.request) {
            // Erro sem resposta do servidor (problema de rede)
            ErrorAlertComponent(
                "Erro de Conexão",
                "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
            );
        } else {
            // Erro na configuração da requisição
            ErrorAlertComponent("Erro", "Ocorreu um erro ao processar sua solicitação.");
        }
        return Promise.reject(error);
    }
);

// Função para verificar se há conexão com a internet
const checkInternetConnection = async () => {
    try {
        await axios.get("https://www.google.com", { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
};

export const links = {
    // Adicionar a URL base da API para uso em componentes
    API_URL: api.defaults.baseURL,
    
    //#region ATIVIDADES
    readActivities: async (id: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get("/activities/list/"+ id);
    },

    readGroupActivities: async (groupId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get("/activities/listgroup/"+ groupId);
    },

    deleteActivity: async (id: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.delete("/activities/delete/"+ id);
    },

    createActivity: async (data: CreateActivities) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        
        // Converter explicitamente warning para booleano
        const warningValue = data.warning === false || data.warning === "false" ? false : Boolean(data.warning);
        
        const activityData = {
            name: data.name,
            description: data.description,
            status: data.status,
            userId: data.userId,
            type: data.type,
            dateExpire: data.dateExpire,
            dateCreated: data.dateCreated,
            priority: data.priority,
            daysForRecover: data.daysForRecover,
            familyId: data.familyId,
            notes: data.notes,
            location: data.location,
            linkUrl: data.linkUrl,
            photoUrl: data.photoUrl,
            documentUrl: data.documentUrl,
            photoName: data.photoName,
            documentName: data.documentName,
            warning: warningValue, // Usar o valor convertido
        };
        
        return api.post("/activities/create", activityData);
    },

    updateActivity: async (data: UpdateActivities) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        
        // Converter explicitamente warning para booleano
        const warningValue = typeof data.warning === 'boolean' ? data.warning : Boolean(data.warning);
        
        const activityData = {
            id: data.id,
            name: data.name,
            description: data.description,
            status: data.status,
            userId: data.userId,
            type: data.type,
            dateExpire: data.dateExpire,
            dateCreated: data.dateCreated,
            priority: data.priority,
            daysForRecover: data.daysForRecover,
            familyId: data.familyId,
            notes: data.notes,
            location: data.location,
            linkUrl: data.linkUrl,
            photoUrl: data.photoUrl,
            documentUrl: data.documentUrl,
            photoName: data.photoName,
            documentName: data.documentName,
            warning: warningValue, // Usar o valor convertido
        };
        
        return api.put("/activities/update", activityData);
    },

    updateActivityStatus: async (id: string, status: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.put("/activities/changeStatus", { id, status });
    },

    // Confirmação de conclusão de atividade em grupo
    confirmGroupDone: async (id: string, userEmail: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return await api.post("/activities/confirmGroupDone", {
            id,
            userEmail
        });
    },
    //#endregion
    
    //#region FAMILIA
    checkUserHaveFamily: async (userEmail: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get("/families/checkUserHaveFamily/"+ userEmail);
    },

    createFamily: async (data: CreateFamilyDTO) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.post("families/create", data);
    },

    getListFamilies: async (userEmail: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get(`/families/listFamilies/${userEmail}`);
    },

    createNewFamily: async (userEmail: string, name: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.post(`/families/create`, { userEmail, name });
    },

    updateFamily: async (data: UpdateFamilyRequest) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.put(`/families/update`, data);
    },

    deleteFamily: async (familyId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.delete(`/families/delete/${familyId}`);
    },

    deleteFamilyMember: async (familyId: string, userEmail: string, userDeleted: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.delete(`/families/deleteMemberOnFamily/${familyId}/${userEmail}/${userDeleted}`);
    },

    getFamilyMembers: async (familyId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get(`/families/listMemberFamily/${familyId}`);
    },

    inviteMember: async (data: InviteMemberRequest) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.post(`/families/invite`, data);
    },

    removeMember: async (familyId: string, memberId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.delete(`/families/removeMember/${familyId}/${memberId}`);
    },

    // Novas funções para convites

    inviteNewMember: async (data: InviteMemberRequest) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.post(`/invites/inviteMemberToFamily`, data);
    },

    getInvitationsReceived: async (userEmail: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get(`/invites/getInvites/${userEmail}`);
    },

    getFamilyInvitationsSent: async (familyId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get(`/invites/getInvitesFamily/${familyId}`);
    },

    acceptInvitation: async (invitationId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.post(`/invites/acceptInviteMember/${invitationId}`);
    },

    deleteInvitation: async (invitationId: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.delete(`/invites/deleteInvite/${invitationId}`);  
    },
    //#endregion
}
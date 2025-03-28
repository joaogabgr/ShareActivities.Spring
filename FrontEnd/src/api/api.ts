import axios, { AxiosError } from "axios";
import { CreateActivities } from "../types/Activities/CreateActivities";
import { UpdateActivities } from "../types/Activities/UpdateActivities";
import { CreateFamilyDTO } from "../types/Family/CreateFamilyDTO";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";

interface ErrorResponse {
    status: number;
    error: string;
}

// Configuração base da API
export const api = axios.create({
    baseURL: "http:/192.168.1.105:8080",
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
    //#region ATIVIDADES
    readActivities: async (id: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.get("/activities/list/"+ id);
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
        return api.post("/activities/create", data);
    },

    updateActivity: async (data: UpdateActivities) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.put("/activities/update", data);
    },

    updateActivityStatus: async (id: string, status: string) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("Sem conexão com a internet");
        }
        return api.put("/activities/changeStatus", { id, status });
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
    }
    //#endregion
}
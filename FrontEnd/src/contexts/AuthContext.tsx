import { createContext, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, UserInfo } from "../types/authTypes";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "expo-router";
import { api } from "../api/api";
import * as SecureStore from 'expo-secure-store';
import { ErrorAlertComponent } from "../app/components/Alerts/AlertComponent";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // 👈 não esquece dessa importação
import { initializeFirebase, getFCMToken, requestNotificationPermission } from "../utils/firebase";



export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  validateToken: () => {},
  user: undefined
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo>();
  const decodificador = jwtDecode;
  const router = useRouter();

  useEffect(() => {
    // Inicializa o Firebase ao carregar o componente
    try {
      initializeFirebase();
      console.log('Firebase inicializado no AuthProvider');
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
    }
    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let pushToken = '';

      // 👉 Obter o token FCM do Firebase se estiver em um dispositivo real
      if (Device.isDevice) {
        try {
          // Verifica se o Firebase está inicializado
          initializeFirebase();
          
          // Solicita permissão para notificações
          const permissionGranted = await requestNotificationPermission();
          
          if (permissionGranted) {
            // Obtém o token FCM
            pushToken = await getFCMToken();
            console.log('Firebase FCM Token:', pushToken);
          } else {
            console.log('Permissão de notificação negada');
          }
        } catch (error) {
          console.error('Erro ao configurar notificações:', error);
        }
      }

      // 👉 Envia o token FCM no corpo da requisição
      const response = await api.post('/auth/login', {
        email,
        password,
        pushToken // Usando o token FCM em vez do expoToken
      });

      const token = response.data.model;

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync('token', token);

      const decodedToken = decodificador(token);
      const JsonUserInfos = decodedToken.sub ? JSON.parse(decodedToken.sub) : null;

      setUser(JsonUserInfos);
      setIsAuthenticated(true);
      router.replace('/pages/Default');
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      ErrorAlertComponent("Erro", "Erro ao fazer login");
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setIsAuthenticated(false);
      setUser(undefined);
      router.replace('/pages/auth/Login');
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const validateToken = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      try {
        const decodedToken = decodificador(token) as any;
        const isExpired = decodedToken?.exp ? decodedToken.exp * 1000 < Date.now() : true;

        if (isExpired) {
          await logout();
          return;
        }

        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        setUser(decodedToken.sub ? JSON.parse(decodedToken.sub) : null);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    } else {
      console.log("Nenhum token encontrado no SecureStore");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

import React from 'react';
import { createContext, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, UserInfo } from "../types/authTypes";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "expo-router";
import { api } from "../api/api";
import * as SecureStore from 'expo-secure-store';
import { ErrorAlertComponent } from "../app/components/Alerts/AlertComponent";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  validateToken: () => {},
  user: undefined
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo>();
  const decodificador = jwtDecode;
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
    });
  
    return () => subscription.remove();
  }, []);
  

  async function registerForPushNotificationsAsync() {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Permissão para notificações não concedida!');
          return;
        }
  
        console.log('Obtendo token de notificação...');
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: "8bb4b263-af83-4e90-a3d0-b4d1d5256812"
        });
        
        console.log('Token de notificação Expo:', tokenData.data);
        return tokenData.data;
      } else {
        console.log('Você deve usar um dispositivo físico para notificações push');
      }
    } catch (error) {
      console.error('Erro ao registrar para notificações push:', error);
      return null;
    }
  }
  

  const login = async (email: string, password: string) => {
    try {
      const expoToken = await registerForPushNotificationsAsync();
  
      const response = await api.post('/auth/login', {
        email,
        password,
        expoToken
      });
  
      const token = response.data.model;
  
      if (!token) {
        throw new Error("Token não retornado no login");
      }
  
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync('token', token);
  
      const decodedToken = decodificador(token);
      const JsonUserInfos = decodedToken.sub ? JSON.parse(decodedToken.sub) : null;
  
      if (!JsonUserInfos) {
        throw new Error("Informações do usuário não encontradas");
      }
  
      setUser(JsonUserInfos);
      setIsAuthenticated(true);
      
      // Redirecionar para a página principal
      router.replace('/pages/Default');
    } catch (error: unknown) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      ErrorAlertComponent("Erro", errorMessage);
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
        const decodedToken = decodificador(token);
        const isExpired = decodedToken?.exp ? decodedToken.exp * 1000 < Date.now() : true;

        // Se o token estiver expirado, deslogar o usuário
        if (isExpired) {
          await logout();
          return;
        }

        // Se o token for válido, configurar o cabeçalho de autenticação
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
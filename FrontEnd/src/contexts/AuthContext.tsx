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
import { Platform } from 'react-native';

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

function decodificador(token: string) {
  return jwtDecode(token);
};

// Função para obter o token do dispositivo para notificações
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '8bb4b263-af83-4e90-a3d0-b4d1d5256812' })).data;
  } else {
    console.log('You must use a physical device for Push Notifications');
  }

  return token;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const decodedToken = decodificador(token);
        
        try {
          const JsonUserInfos = decodedToken.sub ? JSON.parse(decodedToken.sub) : null;
          if (JsonUserInfos) {
            setUser(JsonUserInfos);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Erro ao analisar informações do usuário:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar token armazenado:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setIsAuthenticated(false);
      setUser(undefined);
      router.replace('/pages/auth/Login');
    } catch (error) {
    }
  };
  
  const validateToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }
  
      // Pode adicionar aqui uma validação adicional do token, como verificar a expiração
      const decodedToken = decodificador(token);
      
      // Verificar se exp existe antes de usá-lo
      if (!decodedToken.exp) {
        // Token inválido sem data de expiração
        await SecureStore.deleteItemAsync('token');
        setIsAuthenticated(false);
        ErrorAlertComponent("Token inválido", "Por favor, faça login novamente.");
        router.replace('/pages/auth/Login');
        return false;
      }
      
      const expirationDate = new Date(decodedToken.exp * 1000); // Converter de segundos para milissegundos
      const currentDate = new Date();
  
      if (expirationDate < currentDate) {
        // Token expirado
        await SecureStore.deleteItemAsync('token');
        setIsAuthenticated(false);
        ErrorAlertComponent("Sessão expirada", "Sua sessão expirou. Por favor, faça login novamente.");
        router.replace('/pages/auth/Login');
        return false;
      }

      api.defaults.headers['Authorization'] = ``;
  
      // Preserva o estado de autenticação atual se o token for válido
      return isAuthenticated;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, validateToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, UserInfo } from "../types/authTypes";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "expo-router";
import { api } from "../api/api";
import * as SecureStore from 'expo-secure-store';
import { ErrorAlertComponent } from "../app/components/Alerts/AlertComponent";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // 👈 não esquece dessa importação


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
    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let expoToken = '';

      // 👉 Pega o Expo Push Token se estiver em um dispositivo real
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          expoToken = tokenData.data;
          console.log('Expo Push Token:', expoToken);
        } else {
          console.log('Permissão de notificação negada');
        }
      }

      // 👉 Envia o token do expo no corpo da requisição
      const response = await api.post('/auth/login', {
        email,
        password,
        expoToken
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

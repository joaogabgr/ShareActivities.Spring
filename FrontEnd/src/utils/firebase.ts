import { Platform } from 'react-native';
import { initializeApp, getApp, getApps } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// Inicializa o Firebase se ainda não estiver inicializado
export const initializeFirebase = () => {
  if (getApps().length === 0) {
    // O Firebase será inicializado automaticamente com as configurações
    // do arquivo google-services.json (Android) ou GoogleService-Info.plist (iOS)
    initializeApp({
      // Firebase will automatically read config from google-services.json/GoogleService-Info.plist
      // but we need to pass an empty object to satisfy the type requirement
      appId: '1:1234567890:web:abcdef1234567890',
      projectId: 'shareactivities-203c0'
    });
    console.log('Firebase inicializado com sucesso!');
  } else {
    console.log('Firebase já está inicializado');
  }
  return getApp();
};

// Solicita permissão para notificações push
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
  
  // No Android, as permissões são concedidas automaticamente
  return true;
};

// Obtém o token FCM para o dispositivo
export const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Erro ao obter FCM token:', error);
    return '';
  }
};
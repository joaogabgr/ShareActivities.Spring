import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// Configuração para notificações em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configura o Firebase Messaging para lidar com notificações em segundo plano
export const configureFCMBackgroundHandler = async () => {
  // Registra o dispositivo para mensagens remotas (necessário para iOS)
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
  }

  // Configura o handler para mensagens em segundo plano
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Mensagem recebida em segundo plano!', remoteMessage);
    
    // Exibe a notificação usando o Expo Notifications
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || 'Nova notificação',
        body: remoteMessage.notification?.body || 'Você recebeu uma nova notificação',
        data: remoteMessage.data,
      },
      trigger: null, // Exibe imediatamente
    });
  });

  // Configura o handler para mensagens em primeiro plano
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('Mensagem recebida em primeiro plano!', remoteMessage);
    
    // Exibe a notificação usando o Expo Notifications
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || 'Nova notificação',
        body: remoteMessage.notification?.body || 'Você recebeu uma nova notificação',
        data: remoteMessage.data,
      },
      trigger: null, // Exibe imediatamente
    });
  });

  return unsubscribe;
};
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { colors } from '../globalCSS';
import { initializeFirebase } from '../utils/firebase';
import { configureFCMBackgroundHandler } from './firebase-config';

// Ignorar o aviso do Reanimated
LogBox.ignoreLogs(['[Reanimated]']);

export default function Layout() {
  useEffect(() => {
    // Inicializa o Firebase e configura as notificações
    try {
      initializeFirebase();
      configureFCMBackgroundHandler();
      console.log('Firebase inicializado e notificações configuradas');
    } catch (error) {
      console.error('Erro ao inicializar Firebase ou configurar notificações:', error);
    }
    
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(colors.primary);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar 
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.background },
            gestureEnabled: true,
          }}
        >
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

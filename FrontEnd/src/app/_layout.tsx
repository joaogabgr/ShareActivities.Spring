import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { colors } from '../globalCSS';

// Ignorar o aviso do Reanimated
LogBox.ignoreLogs(['[Reanimated]']);

export default function Layout() {
  useEffect(() => {
    // Configurar a StatusBar uma vez quando o componente é montado
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

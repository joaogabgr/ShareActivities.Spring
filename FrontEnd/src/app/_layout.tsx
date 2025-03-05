import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';

// Ignorar o aviso do Reanimated
LogBox.ignoreLogs(['[Reanimated]']);

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

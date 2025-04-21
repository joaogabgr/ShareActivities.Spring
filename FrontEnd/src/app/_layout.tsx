import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar } from 'react-native';
import { colors } from '../globalCSS';

// Ignorar o aviso do Reanimated
LogBox.ignoreLogs(['[Reanimated]']);

export default function Layout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LocationProvider>
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
        </LocationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

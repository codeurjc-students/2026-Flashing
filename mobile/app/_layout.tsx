import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MobileSessionProvider } from '../session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ClashDisplay: require('../assets/fonts/ClashDisplay-Medium.ttf'),
  });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <MobileSessionProvider>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.white },
          animation: 'none',
        }} />
      </MobileSessionProvider>
    </SafeAreaProvider>
  );
}

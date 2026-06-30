import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { useAuthStore } from '@/store/authStore';
import { THEME } from '@/lib/data';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const { user, loading, onboardingDone, loadSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadSession();
    import('@/lib/contentCache').then(({ ensureContentCached }) => ensureContentCached());
  }, []);

  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  useEffect(() => {
    if (loading || !fontsLoaded) return;
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingDone && !user && !inAuth && segments[0] !== 'onboarding') {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      if (user.role === 'teacher') {
        router.replace('/teacher');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, fontsLoaded, onboardingDone, segments]);

  if (!fontsLoaded || loading) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.softCream } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="location/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="scan/[missionId]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="ar/[missionId]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="mission/[id]/story" />
        <Stack.Screen name="mission/[id]/quiz" />
        <Stack.Screen name="mission/[id]/reward" />
        <Stack.Screen name="teacher/index" />
      </Stack>
    </>
  );
}

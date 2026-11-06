import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';
import { theme } from '../theme';

const TRANSITION = 150;
const easeOut = Easing.bezier(0, 0, 0.58, 1);

export default function Splash() {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const yellow = useSharedValue(0);
  const white = useSharedValue(0);
  const lightLogo = useSharedValue(0);
  const diameter = Math.hypot(width, height);

  useEffect(() => {
    // Pausas y transiciones del prototipo de Figma.
    yellow.set(withDelay(950, withTiming(1, { duration: TRANSITION, easing: easeOut })));
    lightLogo.set(withDelay(950, withTiming(1, { duration: TRANSITION })));
    white.set(withDelay(2450, withTiming(1, { duration: TRANSITION, easing: easeOut })));
    const timer = setTimeout(() => router.replace('/login'), reducedMotion ? 300 : 3250);
    return () => {
      clearTimeout(timer);
      cancelAnimation(yellow);
      cancelAnimation(white);
      cancelAnimation(lightLogo);
    };
  }, [reducedMotion, yellow, white, lightLogo]);

  const yellowStyle = useAnimatedStyle(() => reducedMotion
    ? { opacity: 0 }
    : { transform: [{ scale: yellow.get() }] });
  const whiteStyle = useAnimatedStyle(() => reducedMotion
    ? { opacity: 0 }
    : { transform: [{ scale: white.get() }] });
  const lightStyle = useAnimatedStyle(() => ({ opacity: reducedMotion ? 0 : lightLogo.get() }));
  const darkStyle = useAnimatedStyle(() => ({ opacity: reducedMotion ? 1 : 1 - lightLogo.get() }));
  const circle = {
    width: diameter, height: diameter, borderRadius: diameter / 2,
    left: (width - diameter) / 2, top: (height - diameter) / 2,
  };

  return (
    <View style={styles.screen} accessibilityLabel="Flashing. Iniciando aplicación.">
      <StatusBar hidden />
      <Animated.View pointerEvents="none" style={[styles.circle, circle, styles.yellow, yellowStyle]} />
      <View style={styles.logo}>
        <Animated.View style={[StyleSheet.absoluteFill, darkStyle]}>
          <Image source={require('../assets/branding/flashing.png')} style={StyleSheet.absoluteFill} contentFit="contain" />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
          <Image source={require('../assets/branding/flashing.png')} style={StyleSheet.absoluteFill} contentFit="contain" tintColor={theme.white} />
        </Animated.View>
      </View>
      <Animated.View pointerEvents="none" style={[styles.circle, circle, styles.white, whiteStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  circle: { position: 'absolute' },
  yellow: { backgroundColor: theme.yellow },
  white: { backgroundColor: theme.white },
  logo: { width: 110, height: 163 },
});

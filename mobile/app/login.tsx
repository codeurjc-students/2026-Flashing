import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { Easing, FadeIn, useReducedMotion } from 'react-native-reanimated';
import { login } from '../services/auth';
import { useMobileSession } from '../session';
import { StatusBar } from 'expo-status-bar';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet,
  Text, TextInput, TouchableWithoutFeedback, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

const appearance = FadeIn.duration(450).easing(Easing.bezier(0.4, 0, 0.2, 1));

export default function Login() {
  const reducedMotion = useReducedMotion();
  const { user, loading, setUser } = useMobileSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInput = useRef<ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (user) router.replace('/welcome');
  }, [user]);

  async function handleSubmit() {
    Keyboard.dismiss();
    if (submitting || loading) return;
    if (!email.trim() || !password) {
      setError('Introduce tu correo y contraseña.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      setUser(await login(email.trim(), password));
      setPassword('');
    } catch (exception) {
      setError(exception instanceof TypeError
        ? 'No se ha podido conectar con Flashing. Comprueba tu conexión.'
        : exception instanceof Error ? exception.message : 'No se ha podido iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View pointerEvents="none" accessible={false} style={styles.backdrop}>
        <Animated.View entering={reducedMotion ? undefined : appearance}>
          <Image source={require('../assets/branding/flashing.png')} style={styles.backdropLogo} contentFit="contain" />
        </Animated.View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.content}>
            <Animated.View entering={reducedMotion ? undefined : appearance} style={styles.brand}>
              <Text style={styles.wordmark}>flashing</Text>
              <Text style={styles.description}>Qué bien que estés aquí.</Text>
            </Animated.View>
            <Animated.View entering={reducedMotion ? undefined : appearance} style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input} value={email} onChangeText={setEmail}
                  editable={!submitting}
                  placeholder="Introduce tu correo electrónico" placeholderTextColor={theme.slate}
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                  autoComplete="email" textContentType="emailAddress"
                  accessibilityLabel="Correo electrónico" maxLength={254}
                  returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passwordInput.current?.focus()}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordField}>
                  <TextInput
                    editable={!submitting}
                    ref={passwordInput} style={[styles.input, styles.passwordInput]}
                    value={password} onChangeText={setPassword}
                    placeholder="Introduce tu contraseña" placeholderTextColor={theme.slate}
                    secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false}
                    autoComplete="current-password" textContentType="password"
                    accessibilityLabel="Contraseña" returnKeyType="done" submitBehavior="blurAndSubmit" onSubmitEditing={handleSubmit}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    style={({ pressed }) => [styles.reveal, { opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Text style={styles.revealText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                  </Pressable>
                </View>
              </View>
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <Pressable onPress={handleSubmit} disabled={submitting || loading} accessibilityRole="button"
                accessibilityState={{ disabled: submitting || loading, busy: submitting || loading }}
                style={({ pressed }) => [styles.submit, { opacity: pressed || submitting || loading ? 0.7 : 1 }]}>
                <Text style={styles.submitText}>{submitting ? 'Entrando…' : 'Entrar'}</Text>
                {submitting || loading ? <ActivityIndicator color={theme.white} /> : null}
              </Pressable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { flex: 1, backgroundColor: theme.yellow },
  content: { flexGrow: 1, padding: 24, gap: 32, justifyContent: 'center', width: '100%', maxWidth: 520, alignSelf: 'center' },
  backdrop: { position: 'absolute', right: -170, bottom: -100, opacity: 0.055, transform: [{ rotate: '-15deg' }] },
  backdropLogo: { width: 500, height: 740 },
  brand: { flexDirection: 'column', alignItems: 'flex-start', gap: 0 },
  wordmark: { fontFamily: theme.font, fontSize: 90, letterSpacing: -3, color: theme.black },
  form: { gap: 30, marginTop: 20 },
  description: { fontFamily: theme.font, fontSize: 20, lineHeight: 23, color: theme.black },
  field: { gap: 8 },
  label: { fontFamily: theme.font, fontSize: 15, color: theme.black },
  input: { minHeight: 54, backgroundColor: theme.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontFamily: theme.font, fontSize: 16, color: theme.black },
  passwordField: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, backgroundColor: theme.white },
  passwordInput: { flex: 1, minWidth: 0 },
  reveal: { minWidth: 56, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  revealText: { fontFamily: theme.font, color: theme.slate, fontSize: 14 },
  submit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.black, borderRadius: 100, paddingHorizontal: 22, paddingVertical: 16, minHeight: 54 },
  submitText: { fontFamily: theme.font, fontSize: 17, color: theme.white },
  error: { fontFamily: theme.font, fontSize: 14, lineHeight: 20, textAlign: 'center', color: theme.slate },
});

import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useMobileSession } from '../session';
import { theme } from '../theme';

export default function Welcome() {
  const { user, loading, signOut } = useMobileSession();
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setClosing(true);
    setError('');
    try {
      await signOut();
    } catch {
      setError('No se ha podido cerrar la sesión. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setClosing(false);
    }
  }
  if (loading) return <ActivityIndicator />;
  if (!user) return <Redirect href="/login" />;
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hola, {user.displayName}.</Text>
      <Button title="Cerrar sesión" disabled={closing} onPress={handleSignOut} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.yellow, padding: 32, justifyContent: 'center', gap: 24 },
  title: { fontFamily: theme.font, fontSize: 40, color: theme.black },
});

import { Redirect } from 'expo-router';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useMobileSession } from '../session';
import { theme } from '../theme';

export default function Welcome() {
  const { user, loading, signOut } = useMobileSession();
  if (loading) return <ActivityIndicator />;
  if (!user) return <Redirect href="/login" />;
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hola, {user.displayName}.</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.yellow, padding: 32, justifyContent: 'center', gap: 24 },
  title: { fontFamily: theme.font, fontSize: 40, color: theme.black },
  text: { fontFamily: theme.font, fontSize: 20, color: theme.black },
});

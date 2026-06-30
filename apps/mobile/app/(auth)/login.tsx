import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { THEME } from '@/lib/data';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    await loginDemo(email, password, role);
    if (role === 'teacher') {
      router.replace('/teacher');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[THEME.merlionRed, THEME.heritageGold]} style={styles.header}>
          <Text style={styles.logo}>🦁</Text>
          <Text style={styles.appName}>Heritage Quest AR</Text>
          <Text style={styles.tagline}>Discover Singapore's Stories</Text>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
              onPress={() => setRole('student')}
            >
              <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>🎒 Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'teacher' && styles.roleBtnActive]}
              onPress={() => setRole('teacher')}
            >
              <Text style={[styles.roleBtnText, role === 'teacher' && styles.roleBtnTextActive]}>👩‍🏫 Teacher</Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#AAA" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#AAA" />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkText}>New here? <Text style={styles.linkBold}>Sign up</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  scroll: { flexGrow: 1 },
  header: { paddingTop: 80, paddingBottom: 40, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logo: { fontSize: 56, marginBottom: 8 },
  appName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: THEME.white },
  tagline: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.white, opacity: 0.9, marginTop: 4 },
  form: { padding: 24, marginTop: 8 },
  roleToggle: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: THEME.white, alignItems: 'center', borderWidth: 2, borderColor: '#E8E0D5' },
  roleBtnActive: { borderColor: THEME.tropicalTeal, backgroundColor: '#E8F8F5' },
  roleBtnText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 14, color: THEME.deepNavy, opacity: 0.6 },
  roleBtnTextActive: { opacity: 1, color: THEME.tropicalTeal },
  input: { backgroundColor: THEME.white, borderRadius: 14, padding: 16, fontFamily: 'Quicksand_500Medium', fontSize: 16, color: THEME.deepNavy, borderWidth: 2, borderColor: '#E8E0D5', marginBottom: 12 },
  error: { fontFamily: 'Quicksand_600SemiBold', color: THEME.error, marginBottom: 8 },
  button: { backgroundColor: THEME.tropicalTeal, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
  linkBtn: { alignItems: 'center', marginTop: 20 },
  linkText: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.deepNavy, opacity: 0.7 },
  linkBold: { fontFamily: 'Quicksand_700Bold', color: THEME.tropicalTeal },
});

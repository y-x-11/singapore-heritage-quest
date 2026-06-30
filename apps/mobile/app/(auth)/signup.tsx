import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { THEME } from '@/lib/data';

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classCode, setClassCode] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const signupDemo = useAuthStore((s) => s.signupDemo);
  const router = useRouter();

  const handleSignup = async () => {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (role === 'student' && !classCode) {
      setError('Students need a class code from their teacher');
      return;
    }
    setError('');
    await signupDemo(email, password, displayName, role, classCode || undefined);
    if (role === 'teacher') {
      router.replace('/teacher');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Join the Quest! 🎉</Text>
          <Text style={styles.subtitle}>Create your explorer account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleToggle}>
            <TouchableOpacity style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]} onPress={() => setRole('student')}>
              <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>🎒 Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleBtn, role === 'teacher' && styles.roleBtnActive]} onPress={() => setRole('teacher')}>
              <Text style={[styles.roleBtnText, role === 'teacher' && styles.roleBtnTextActive]}>👩‍🏫 Teacher</Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} placeholderTextColor="#AAA" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#AAA" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#AAA" />
          {role === 'student' && (
            <TextInput style={styles.input} placeholder="Class Code (from teacher)" value={classCode} onChangeText={setClassCode} autoCapitalize="characters" placeholderTextColor="#AAA" />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  scroll: { flexGrow: 1, paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: THEME.deepNavy },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 15, color: THEME.deepNavy, opacity: 0.6, marginTop: 4 },
  form: { padding: 24 },
  roleToggle: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: THEME.white, alignItems: 'center', borderWidth: 2, borderColor: '#E8E0D5' },
  roleBtnActive: { borderColor: THEME.tropicalTeal, backgroundColor: '#E8F8F5' },
  roleBtnText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 14, color: THEME.deepNavy, opacity: 0.6 },
  roleBtnTextActive: { opacity: 1, color: THEME.tropicalTeal },
  input: { backgroundColor: THEME.white, borderRadius: 14, padding: 16, fontFamily: 'Quicksand_500Medium', fontSize: 16, color: THEME.deepNavy, borderWidth: 2, borderColor: '#E8E0D5', marginBottom: 12 },
  error: { fontFamily: 'Quicksand_600SemiBold', color: THEME.error, marginBottom: 8 },
  button: { backgroundColor: THEME.merlionRed, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
  linkBtn: { alignItems: 'center', marginTop: 20 },
  linkText: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.deepNavy, opacity: 0.7 },
  linkBold: { fontFamily: 'Quicksand_700Bold', color: THEME.tropicalTeal },
});

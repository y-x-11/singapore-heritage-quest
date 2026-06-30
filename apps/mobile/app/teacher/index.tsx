import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientHeader } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { MISSIONS, DASHBOARD_URL, THEME } from '@/lib/data';

const DEMO_STUDENTS = [
  { name: 'Aisha K.', xp: 320, completed: 5, stuck: false },
  { name: 'Marcus T.', xp: 275, completed: 4, stuck: false },
  { name: 'Priya S.', xp: 210, completed: 3, stuck: true },
  { name: 'James L.', xp: 180, completed: 2, stuck: true },
  { name: 'Emma W.', xp: 150, completed: 2, stuck: false },
];

export default function TeacherMobileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const classCode = 'HERIT1';
  const avgCompletion = Math.round(DEMO_STUDENTS.reduce((s, st) => s + st.completed, 0) / DEMO_STUDENTS.length / MISSIONS.length * 100);
  const stuckStudents = DEMO_STUDENTS.filter((s) => s.stuck);

  return (
    <View style={styles.container}>
      <GradientHeader title="Teacher Dashboard" subtitle={`Welcome, ${user?.displayName ?? 'Teacher'}`} colors={[THEME.deepNavy, THEME.purple]} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Class Join Code</Text>
          <Text style={styles.code}>{classCode}</Text>
          <Text style={styles.codeHint}>Share this code with students to join your class</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{DEMO_STUDENTS.length}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{avgCompletion}%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stuckStudents.length}</Text>
            <Text style={styles.statLabel}>Need Help</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>👥 Class Roster</Text>
        {DEMO_STUDENTS.map((student) => (
          <View key={student.name} style={styles.studentRow}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentMeta}>{student.completed}/{MISSIONS.length} missions · {student.xp} XP</Text>
            </View>
            {student.stuck && (
              <View style={styles.stuckBadge}>
                <Text style={styles.stuckText}>Stuck</Text>
              </View>
            )}
          </View>
        ))}

        {stuckStudents.length > 0 && (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Students Who Need Help</Text>
            {stuckStudents.map((s) => (
              <Text key={s.name} style={styles.alertItem}>• {s.name} — hasn't progressed recently</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.webBtn} onPress={() => Linking.openURL(DASHBOARD_URL)}>
          <Text style={styles.webBtnText}>🖥️ Open Full Web Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await logout();
            router.replace('/(auth)/login');
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  content: { padding: 20, paddingBottom: 40 },
  codeCard: { backgroundColor: THEME.white, borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: THEME.tropicalTeal, borderStyle: 'dashed' },
  codeLabel: { fontFamily: 'Quicksand_600SemiBold', fontSize: 13, color: THEME.deepNavy, opacity: 0.6 },
  code: { fontFamily: 'Nunito_800ExtraBold', fontSize: 36, color: THEME.tropicalTeal, letterSpacing: 6, marginVertical: 8 },
  codeHint: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: THEME.deepNavy, opacity: 0.5, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: THEME.white, borderRadius: 14, padding: 14, alignItems: 'center' },
  statNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: THEME.tropicalTeal },
  statLabel: { fontFamily: 'Quicksand_500Medium', fontSize: 11, color: THEME.deepNavy, opacity: 0.6, marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: THEME.deepNavy, marginBottom: 12 },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  studentInfo: { flex: 1 },
  studentName: { fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.deepNavy },
  studentMeta: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: THEME.deepNavy, opacity: 0.5, marginTop: 2 },
  stuckBadge: { backgroundColor: '#FFF0F3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stuckText: { fontFamily: 'Quicksand_700Bold', fontSize: 11, color: THEME.error },
  alertCard: { backgroundColor: '#FFF8E8', borderRadius: 14, padding: 16, marginTop: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: THEME.sunshineYellow },
  alertTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: THEME.deepNavy, marginBottom: 8 },
  alertItem: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, opacity: 0.7, marginBottom: 4 },
  webBtn: { backgroundColor: THEME.deepNavy, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  webBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: THEME.white },
  logoutBtn: { padding: 16, alignItems: 'center' },
  logoutText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.error },
});

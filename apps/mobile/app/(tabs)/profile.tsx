import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { XPBar, StreakBadge, GradientHeader } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { MISSIONS, THEME } from '@/lib/data';
import { useRouter } from 'expo-router';

const DEMO_LEADERBOARD = [
  { name: 'You', xp: 0, isYou: true },
  { name: 'Aisha K.', xp: 320, isYou: false },
  { name: 'Marcus T.', xp: 275, isYou: false },
  { name: 'Priya S.', xp: 210, isYou: false },
  { name: 'James L.', xp: 180, isYou: false },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const progress = useAuthStore((s) => s.progress);
  const badges = useAuthStore((s) => s.badges);
  const collectibles = useAuthStore((s) => s.collectibles);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const completed = progress.filter((p) => p.status === 'completed').length;
  const leaderboard = DEMO_LEADERBOARD.map((e) =>
    e.isYou ? { ...e, name: user?.displayName ?? 'You', xp: user?.xp ?? 0 } : e
  ).sort((a, b) => b.xp - a.xp);

  const handleLogout = () => {
    Alert.alert('Log out?', 'See you on your next heritage adventure!', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Profile" subtitle={user?.email} colors={[THEME.deepNavy, THEME.purple]} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.avatar}>🧭</Text>
          <Text style={styles.name}>{user?.displayName}</Text>
          <Text style={styles.role}>{user?.role === 'student' ? '🎒 Student Explorer' : '👩‍🏫 Teacher'}</Text>
          <View style={styles.statsRow}>
            <StreakBadge streak={user?.streak ?? 0} />
          </View>
          <XPBar xp={user?.xp ?? 0} level={user?.level ?? 1} />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completed}</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{collectibles.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>🏆 Class Leaderboard</Text>
        {leaderboard.map((entry, i) => (
          <View key={entry.name} style={[styles.leaderRow, entry.isYou && styles.leaderRowYou]}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.leaderName}>{entry.name}{entry.isYou ? ' (you)' : ''}</Text>
            <Text style={styles.leaderXp}>{entry.xp} XP</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: { backgroundColor: THEME.white, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 16 },
  avatar: { fontSize: 56, marginBottom: 8 },
  name: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: THEME.deepNavy },
  role: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.tropicalTeal, marginTop: 4 },
  statsRow: { marginTop: 12 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: THEME.white, borderRadius: 16, padding: 16, alignItems: 'center' },
  statNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: THEME.tropicalTeal },
  statLabel: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: THEME.deepNavy, opacity: 0.6, marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: THEME.deepNavy, marginBottom: 12 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  leaderRowYou: { borderWidth: 2, borderColor: THEME.tropicalTeal },
  rank: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: THEME.heritageGold, width: 30 },
  leaderName: { flex: 1, fontFamily: 'Quicksand_600SemiBold', fontSize: 14, color: THEME.deepNavy },
  leaderXp: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: THEME.tropicalTeal },
  logoutBtn: { marginTop: 24, padding: 16, alignItems: 'center' },
  logoutText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.error },
});

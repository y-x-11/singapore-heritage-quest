import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { XPBar, StreakBadge } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { DAILY_QUESTS, MISSIONS, THEME } from '@/lib/data';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const progress = useAuthStore((s) => s.progress);
  const router = useRouter();

  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const dailyQuest = DAILY_QUESTS[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={[THEME.tropicalTeal, '#44CFAE']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hey, {user?.displayName ?? 'Explorer'}! 👋</Text>
            <Text style={styles.subGreeting}>Ready for today's heritage adventure?</Text>
          </View>
          <StreakBadge streak={user?.streak ?? 0} />
        </View>
        <XPBar xp={user?.xp ?? 0} level={user?.level ?? 1} />
      </LinearGradient>

      <View style={styles.mascotCard}>
        <Text style={styles.mascotEmoji}>🦁</Text>
        <View style={styles.mascotText}>
          <Text style={styles.mascotTitle}>Merlion Guide says:</Text>
          <Text style={styles.mascotQuote}>
            {completedCount === 0
              ? "Start by exploring the map! Three heritage zones await you."
              : `Amazing! You've completed ${completedCount} of ${MISSIONS.length} missions. Keep going!`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Daily Quest</Text>
        <View style={styles.questCard}>
          <Text style={styles.questTitle}>{dailyQuest.title}</Text>
          <Text style={styles.questDesc}>{dailyQuest.description}</Text>
          <View style={styles.questFooter}>
            <Text style={styles.questXp}>+{dailyQuest.xpReward} XP</Text>
            <TouchableOpacity style={styles.questBtn} onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.questBtnText}>Go!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗺️ Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#FFE8E8' }]} onPress={() => router.push('/(tabs)/map')}>
            <Text style={styles.actionEmoji}>🗺️</Text>
            <Text style={styles.actionLabel}>Explore Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#E8F8F5' }]} onPress={() => router.push('/(tabs)/missions')}>
            <Text style={styles.actionEmoji}>🎯</Text>
            <Text style={styles.actionLabel}>Missions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]} onPress={() => router.push('/(tabs)/collection')}>
            <Text style={styles.actionEmoji}>🏆</Text>
            <Text style={styles.actionLabel}>Collection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  content: { paddingBottom: 32 },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  greeting: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: THEME.white },
  subGreeting: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.white, opacity: 0.9, marginTop: 2 },
  mascotCard: { flexDirection: 'row', backgroundColor: THEME.white, margin: 20, marginTop: -16, borderRadius: 20, padding: 16, alignItems: 'center', gap: 12, shadowColor: THEME.deepNavy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  mascotEmoji: { fontSize: 40 },
  mascotText: { flex: 1 },
  mascotTitle: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: THEME.heritageGold },
  mascotQuote: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, lineHeight: 18, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: THEME.deepNavy, marginBottom: 12 },
  questCard: { backgroundColor: THEME.white, borderRadius: 18, padding: 16, borderLeftWidth: 4, borderLeftColor: THEME.sunshineYellow },
  questTitle: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: THEME.deepNavy },
  questDesc: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, opacity: 0.7, marginTop: 4 },
  questFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  questXp: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: THEME.heritageGold },
  questBtn: { backgroundColor: THEME.sunshineYellow, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  questBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: THEME.deepNavy },
  actions: { flexDirection: 'row', gap: 10 },
  actionCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  actionEmoji: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontFamily: 'Quicksand_600SemiBold', fontSize: 12, color: THEME.deepNavy },
});

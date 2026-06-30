import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ConfettiOverlay } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { MISSIONS, BADGES, COLLECTIBLES, THEME } from '@/lib/data';

export default function RewardScreen() {
  const { id, score, total, pct } = useLocalSearchParams<{ id: string; score: string; total: string; pct: string }>();
  const router = useRouter();
  const updateProgress = useAuthStore((s) => s.updateProgress);
  const awardXp = useAuthStore((s) => s.awardXp);
  const awardBadge = useAuthStore((s) => s.awardBadge);
  const awardCollectible = useAuthStore((s) => s.awardCollectible);

  const mission = MISSIONS.find((m) => m.id === id);
  const badge = BADGES.find((b) => b.id === mission?.badgeId);
  const collectible = mission?.collectibleIds[0] ? COLLECTIBLES.find((c) => c.id === mission.collectibleIds[0]) : null;
  const scoreNum = parseInt(score ?? '0', 10);
  const totalNum = parseInt(total ?? '5', 10);
  const pctNum = parseInt(pct ?? '0', 10);

  useEffect(() => {
    if (!mission) return;
    (async () => {
      await updateProgress(mission.id, mission.locationId, 'completed', { quizScore: pctNum });
      await awardXp(mission.xpReward);
      if (pctNum === 100) await awardBadge('badge-quiz-master');
      if (mission.badgeId) await awardBadge(mission.badgeId);
      if (collectible) await awardCollectible(collectible.id);
    })();
  }, [mission?.id]);

  if (!mission) {
    return (
      <View style={styles.center}>
        <Text>Mission not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConfettiOverlay active />
      <LinearGradient colors={[THEME.sunshineYellow, THEME.heritageGold]} style={styles.header}>
        <Animated.Text entering={ZoomIn.duration(500)} style={styles.trophy}>🎉</Animated.Text>
        <Text style={styles.title}>Mission Complete!</Text>
        <Text style={styles.subtitle}>{mission.title}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
          <Text style={styles.statLabel}>Quiz Score</Text>
          <Text style={styles.statValue}>{scoreNum}/{totalNum} ({pctNum}%)</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.statCard}>
          <Text style={styles.statLabel}>XP Earned</Text>
          <Text style={styles.statValue}>+{mission.xpReward} XP</Text>
        </Animated.View>

        {badge && (
          <Animated.View entering={FadeInDown.delay(600)} style={styles.rewardCard}>
            <Text style={styles.rewardEmoji}>{badge.emoji}</Text>
            <Text style={styles.rewardName}>Badge: {badge.name}</Text>
          </Animated.View>
        )}

        {collectible && (
          <Animated.View entering={FadeInDown.delay(800)} style={styles.rewardCard}>
            <Text style={styles.rewardEmoji}>{collectible.emoji}</Text>
            <Text style={styles.rewardName}>Collectible: {collectible.name}</Text>
          </Animated.View>
        )}

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 80, paddingBottom: 32, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  trophy: { fontSize: 64, marginBottom: 12 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: THEME.deepNavy },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 15, color: THEME.deepNavy, opacity: 0.7, marginTop: 4 },
  content: { padding: 24 },
  statCard: { backgroundColor: THEME.white, borderRadius: 16, padding: 18, marginBottom: 12, alignItems: 'center' },
  statLabel: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, opacity: 0.6 },
  statValue: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: THEME.tropicalTeal, marginTop: 4 },
  rewardCard: { backgroundColor: THEME.white, borderRadius: 16, padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rewardEmoji: { fontSize: 36 },
  rewardName: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: THEME.deepNavy },
  homeBtn: { backgroundColor: THEME.tropicalTeal, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  homeBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
});

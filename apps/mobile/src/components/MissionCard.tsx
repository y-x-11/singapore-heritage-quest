import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '@/lib/data';
import type { Mission, MissionStatus } from '@/lib/data';

interface MissionCardProps {
  mission: Mission;
  status: MissionStatus;
  onPress: () => void;
}

const STATUS_LABELS: Record<MissionStatus, string> = {
  locked: '🔒 Locked',
  discovered: '👀 Discovered',
  unlocked: '✨ Ready',
  completed: '✅ Done',
};

const STATUS_COLORS: Record<MissionStatus, string> = {
  locked: '#B0B0B0',
  discovered: THEME.sunshineYellow,
  unlocked: THEME.tropicalTeal,
  completed: THEME.success,
};

export function MissionCard({ mission, status, onPress }: MissionCardProps) {
  const disabled = status === 'locked';
  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.xp}>+{mission.xpReward} XP</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[status]}</Text>
        </View>
      </View>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.story} numberOfLines={2}>{mission.story}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: THEME.tropicalTeal,
    shadowColor: THEME.deepNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  disabled: { opacity: 0.6 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  xp: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: THEME.heritageGold },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 11, color: THEME.deepNavy },
  title: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.deepNavy, marginBottom: 4 },
  story: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, opacity: 0.65, lineHeight: 18 },
});

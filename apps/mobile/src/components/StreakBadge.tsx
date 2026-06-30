import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/lib/data';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  emoji: { fontSize: 18 },
  count: { fontFamily: 'Nunito_800ExtraBold', fontSize: 18, color: THEME.merlionRed },
  label: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: THEME.deepNavy, opacity: 0.7 },
});

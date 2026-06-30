import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME, levelProgress } from '@/lib/data';

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const progress = levelProgress(xp);
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.level}>Lv. {level}</Text>
        <Text style={styles.xp}>{xp} XP</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[THEME.sunshineYellow, THEME.heritageGold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  level: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: THEME.deepNavy },
  xp: { fontFamily: 'Quicksand_600SemiBold', fontSize: 13, color: THEME.tropicalTeal },
  track: { height: 14, backgroundColor: '#E8E0D5', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
});

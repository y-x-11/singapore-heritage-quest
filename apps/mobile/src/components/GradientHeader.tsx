import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/lib/data';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  colors?: string[];
}

export function GradientHeader({ title, subtitle, colors = [THEME.merlionRed, THEME.heritageGold] }: GradientHeaderProps) {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: THEME.white },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.white, opacity: 0.9, marginTop: 4 },
});

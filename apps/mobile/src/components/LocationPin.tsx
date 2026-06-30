import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { THEME } from '@/lib/data';

interface LocationPinProps {
  emoji: string;
  name: string;
  color: string;
  nearby: boolean;
  discovered: boolean;
}

export function LocationPin({ emoji, name, color, nearby, discovered }: LocationPinProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (nearby) {
      scale.value = withRepeat(withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      scale.value = withTiming(1);
    }
  }, [nearby]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pin, { backgroundColor: color, borderColor: nearby ? THEME.sunshineYellow : color }, animStyle]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>
      <Text style={styles.name}>{name}</Text>
      {nearby && <View style={styles.nearbyBadge}><Text style={styles.nearbyText}>Nearby!</Text></View>}
      {discovered && !nearby && <Text style={styles.discovered}>Discovered ✓</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 8 },
  pin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  emoji: { fontSize: 26 },
  name: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: THEME.deepNavy, marginTop: 4, textAlign: 'center' },
  nearbyBadge: { backgroundColor: THEME.sunshineYellow, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  nearbyText: { fontFamily: 'Quicksand_700Bold', fontSize: 10, color: THEME.deepNavy },
  discovered: { fontFamily: 'Quicksand_500Medium', fontSize: 10, color: THEME.tropicalTeal, marginTop: 2 },
});

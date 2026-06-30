import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { THEME } from '@/lib/data';

const { width, height } = Dimensions.get('window');
const COLORS = [THEME.merlionRed, THEME.sunshineYellow, THEME.tropicalTeal, THEME.purple, THEME.heritageGold];

interface ConfettiOverlayProps {
  active: boolean;
}

function ConfettiPiece({ index }: { index: number }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      index * 80,
      withTiming(height + 50, { duration: 2000 + Math.random() * 1000, easing: Easing.out(Easing.quad) })
    );
    rotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
    opacity.value = withDelay(index * 80 + 1500, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        style,
        {
          backgroundColor: COLORS[index % COLORS.length],
          left: (index * 37) % width,
        },
      ]}
    />
  );
}

export function ConfettiOverlay({ active }: ConfettiOverlayProps) {
  if (!active) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  piece: { position: 'absolute', width: 10, height: 10, borderRadius: 2, top: 0 },
});

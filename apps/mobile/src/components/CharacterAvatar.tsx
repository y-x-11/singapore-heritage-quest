import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/lib/data';

interface CharacterAvatarProps {
  emoji: string;
  color: string;
  size?: number;
  locked?: boolean;
}

export function CharacterAvatar({ emoji, color, size = 80, locked = false }: CharacterAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: locked ? '#E0E0E0' : color + '33', borderColor: locked ? '#B0B0B0' : color }]}>
      <Text style={[styles.emoji, { fontSize: size * 0.5, opacity: locked ? 0.3 : 1 }]}>{locked ? '❓' : emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {},
});

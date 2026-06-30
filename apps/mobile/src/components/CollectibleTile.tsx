import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '@/lib/data';
import type { Collectible } from '@/lib/data';

interface CollectibleTileProps {
  collectible: Collectible;
  owned: boolean;
  onPress?: () => void;
}

const RARITY_COLORS = {
  common: '#B0BEC5',
  rare: THEME.purple,
  legendary: THEME.heritageGold,
};

export function CollectibleTile({ collectible, owned, onPress }: CollectibleTileProps) {
  return (
    <TouchableOpacity
      style={[styles.tile, !owned && styles.locked, { borderColor: RARITY_COLORS[collectible.rarity] }]}
      onPress={onPress}
      activeOpacity={owned ? 0.8 : 1}
    >
      <Text style={[styles.emoji, !owned && styles.lockedEmoji]}>{owned ? collectible.emoji : '❓'}</Text>
      <Text style={[styles.name, !owned && styles.lockedText]} numberOfLines={1}>
        {owned ? collectible.name : '???'}
      </Text>
      {owned && (
        <View style={[styles.rarity, { backgroundColor: RARITY_COLORS[collectible.rarity] }]}>
          <Text style={styles.rarityText}>{collectible.rarity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '47%',
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: THEME.deepNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  locked: { backgroundColor: '#F0EDE8', opacity: 0.8 },
  emoji: { fontSize: 36, marginBottom: 8 },
  lockedEmoji: { opacity: 0.4 },
  name: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: THEME.deepNavy, textAlign: 'center' },
  lockedText: { opacity: 0.4 },
  rarity: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  rarityText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 10, color: THEME.white, textTransform: 'capitalize' },
});

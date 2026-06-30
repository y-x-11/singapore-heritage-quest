import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CollectibleTile, GradientHeader } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { COLLECTIBLES, BADGES, THEME } from '@/lib/data';

export default function CollectionScreen() {
  const badges = useAuthStore((s) => s.badges);
  const collectibles = useAuthStore((s) => s.collectibles);

  return (
    <View style={styles.container}>
      <GradientHeader title="Collection" subtitle="Badges & Heritage Treasures" colors={[THEME.heritageGold, THEME.merlionRed]} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>🏅 Badges ({badges.length}/{BADGES.length})</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => {
            const owned = badges.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, !owned && styles.locked]}>
                <Text style={[styles.badgeEmoji, !owned && styles.lockedEmoji]}>{owned ? badge.emoji : '🔒'}</Text>
                <Text style={[styles.badgeName, !owned && styles.lockedText]}>{owned ? badge.name : '???'}</Text>
                {owned && <Text style={styles.badgeDesc}>{badge.description}</Text>}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>💎 Collectibles ({collectibles.length}/{COLLECTIBLES.length})</Text>
        <View style={styles.collectibleGrid}>
          {COLLECTIBLES.map((c) => (
            <CollectibleTile key={c.id} collectible={c} owned={collectibles.includes(c.id)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  content: { padding: 20, paddingBottom: 32 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: THEME.deepNavy, marginBottom: 12, marginTop: 8 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  badgeCard: { width: '47%', backgroundColor: THEME.white, borderRadius: 16, padding: 14, alignItems: 'center' },
  locked: { opacity: 0.6, backgroundColor: '#F0EDE8' },
  badgeEmoji: { fontSize: 32, marginBottom: 6 },
  lockedEmoji: { opacity: 0.4 },
  badgeName: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: THEME.deepNavy, textAlign: 'center' },
  lockedText: { opacity: 0.4 },
  badgeDesc: { fontFamily: 'Quicksand_500Medium', fontSize: 10, color: THEME.deepNavy, opacity: 0.6, textAlign: 'center', marginTop: 4 },
  collectibleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

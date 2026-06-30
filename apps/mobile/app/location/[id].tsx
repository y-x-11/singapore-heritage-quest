import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CharacterAvatar, MissionCard } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { LOCATIONS, CHARACTERS, MISSIONS, THEME } from '@/lib/data';
import type { MissionStatus } from '@/lib/data';

export default function LocationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const progress = useAuthStore((s) => s.progress);
  const router = useRouter();

  const location = LOCATIONS.find((l) => l.id === id);
  const character = CHARACTERS.find((c) => c.id === location?.characterId);
  const missions = MISSIONS.filter((m) => m.locationId === id).sort((a, b) => a.order - b.order);

  if (!location || !character) {
    return (
      <View style={styles.container}>
        <Text>Location not found</Text>
      </View>
    );
  }

  const characterUnlocked = progress.some((p) => p.locationId === id && (p.status === 'unlocked' || p.status === 'completed'));

  const getStatus = (missionId: string, order: number): MissionStatus => {
    const p = progress.find((pr) => pr.missionId === missionId);
    if (p) return p.status;
    if (order === 1) {
      const discovered = progress.some((pr) => pr.locationId === id);
      return discovered ? 'discovered' : 'locked';
    }
    const prev = missions.find((m) => m.order === order - 1);
    if (prev) {
      const prevP = progress.find((pr) => pr.missionId === prev.id);
      if (prevP?.status === 'completed') return 'discovered';
    }
    return 'locked';
  };

  const handleMission = (missionId: string, status: MissionStatus) => {
    if (status === 'unlocked' || status === 'completed') router.push(`/mission/${missionId}/story`);
    else if (status === 'discovered') router.push(`/scan/${missionId}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: location.color }]}>
        <TouchableOpacity style={styles.close} onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.locEmoji}>{location.emoji}</Text>
        <Text style={styles.locName}>{location.name}</Text>
        <Text style={styles.locDistrict}>{location.district}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>{location.description}</Text>

        <View style={styles.characterSection}>
          <CharacterAvatar emoji={character.emoji} color={character.color} size={90} locked={!characterUnlocked} />
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>{characterUnlocked ? character.name : '???'}</Text>
            <Text style={styles.characterTitle}>{characterUnlocked ? character.title : 'Scan a card to meet this character'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Missions</Text>
        {missions.map((mission) => {
          const status = getStatus(mission.id, mission.order);
          return (
            <MissionCard key={mission.id} mission={mission} status={status} onPress={() => handleMission(mission.id, status)} />
          );
        })}

        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => {
            const firstDiscovered = missions.find((m) => getStatus(m.id, m.order) === 'discovered');
            if (firstDiscovered) router.push(`/scan/${firstDiscovered.id}`);
            else if (missions[0]) router.push(`/scan/${missions[0].id}`);
          }}
        >
          <Text style={styles.scanBtnText}>📷 Scan Heritage Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  header: { paddingTop: 56, paddingBottom: 24, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  close: { position: 'absolute', top: 56, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 18, color: THEME.white, fontWeight: 'bold' },
  locEmoji: { fontSize: 48, marginBottom: 8 },
  locName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: THEME.white },
  locDistrict: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.white, opacity: 0.9 },
  content: { padding: 20, paddingBottom: 40 },
  description: { fontFamily: 'Quicksand_500Medium', fontSize: 15, color: THEME.deepNavy, lineHeight: 22, marginBottom: 20 },
  characterSection: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: THEME.white, borderRadius: 18, padding: 16, marginBottom: 20 },
  characterInfo: { flex: 1 },
  characterName: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.deepNavy },
  characterTitle: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.deepNavy, opacity: 0.6, marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: THEME.deepNavy, marginBottom: 12 },
  scanBtn: { backgroundColor: THEME.tropicalTeal, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  scanBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: THEME.white },
});

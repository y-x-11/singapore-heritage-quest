import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MissionCard, GradientHeader } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { MISSIONS, LOCATIONS, THEME } from '@/lib/data';
import type { MissionStatus } from '@/lib/data';

export default function MissionsScreen() {
  const progress = useAuthStore((s) => s.progress);
  const router = useRouter();

  const getStatus = (missionId: string, locationId: string, order: number): MissionStatus => {
    const p = progress.find((pr) => pr.missionId === missionId);
    if (p) return p.status;
    if (order === 1) {
      const locDiscovered = progress.some((pr) => pr.locationId === locationId);
      return locDiscovered ? 'discovered' : 'locked';
    }
    const prevMission = MISSIONS.filter((m) => m.locationId === locationId).find((m) => m.order === order - 1);
    if (prevMission) {
      const prev = progress.find((pr) => pr.missionId === prevMission.id);
      if (prev?.status === 'completed') return 'discovered';
    }
    return 'locked';
  };

  const handleMission = (missionId: string, status: MissionStatus) => {
    if (status === 'completed') {
      router.push(`/mission/${missionId}/story`);
    } else if (status === 'unlocked') {
      router.push(`/mission/${missionId}/story`);
    } else if (status === 'discovered') {
      router.push(`/scan/${missionId}`);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Missions" subtitle={`${progress.filter((p) => p.status === 'completed').length} / ${MISSIONS.length} completed`} />
      <ScrollView contentContainerStyle={styles.content}>
        {LOCATIONS.map((loc) => {
          const locMissions = MISSIONS.filter((m) => m.locationId === loc.id).sort((a, b) => a.order - b.order);
          return (
            <View key={loc.id} style={styles.section}>
              <View style={styles.locHeader}>
                <Text style={styles.locEmoji}>{loc.emoji}</Text>
                <Text style={styles.locName}>{loc.name}</Text>
              </View>
              {locMissions.map((mission) => {
                const status = getStatus(mission.id, loc.id, mission.order);
                return (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    status={status}
                    onPress={() => handleMission(mission.id, status)}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  content: { padding: 20, paddingBottom: 32 },
  section: { marginBottom: 24 },
  locHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  locEmoji: { fontSize: 24 },
  locName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, color: THEME.deepNavy },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MISSIONS, CHARACTERS, THEME } from '@/lib/data';

export default function MissionStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const mission = MISSIONS.find((m) => m.id === id);
  const character = CHARACTERS.find((c) => c.id === mission?.characterId);

  if (!mission || !character) {
    return (
      <View style={styles.center}>
        <Text>Mission not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: character.color }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.narrator}>Narrated by {character.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.story}>{mission.story}</Text>

        {mission.storyPanels.map((panel, i) => (
          <View key={i} style={styles.panel}>
            <Text style={styles.panelEmoji}>{panel.emoji}</Text>
            <Text style={styles.panelText}>{panel.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.quizBtn} onPress={() => router.push(`/mission/${mission.id}/quiz`)}>
          <Text style={styles.quizBtnText}>Take the Quiz! 🧠</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { fontFamily: 'Quicksand_600SemiBold', fontSize: 14, color: THEME.white, opacity: 0.9, marginBottom: 12 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: THEME.white },
  narrator: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.white, opacity: 0.85, marginTop: 4 },
  content: { padding: 20, paddingBottom: 100 },
  story: { fontFamily: 'Quicksand_600SemiBold', fontSize: 17, color: THEME.deepNavy, lineHeight: 26, marginBottom: 20, fontStyle: 'italic' },
  panel: { backgroundColor: THEME.white, borderRadius: 18, padding: 18, marginBottom: 14, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderLeftWidth: 4, borderLeftColor: THEME.tropicalTeal },
  panelEmoji: { fontSize: 32 },
  panelText: { flex: 1, fontFamily: 'Quicksand_500Medium', fontSize: 15, color: THEME.deepNavy, lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: THEME.softCream },
  quizBtn: { backgroundColor: THEME.merlionRed, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  quizBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
});

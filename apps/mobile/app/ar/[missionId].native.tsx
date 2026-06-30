import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MISSIONS, CHARACTERS, THEME } from '@/lib/data';

export default function ARCharacterScreen() {
  const { missionId } = useLocalSearchParams<{ missionId: string }>();
  const [permission] = useCameraPermissions();
  const router = useRouter();

  const mission = MISSIONS.find((m) => m.id === missionId);
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
      {permission?.granted ? (
        <CameraView style={styles.camera} facing="back" />
      ) : (
        <View style={[styles.camera, { backgroundColor: '#1a1a2e' }]} />
      )}

      <View style={styles.overlay}>
        <Animated.View entering={FadeInUp.duration(600)} style={[styles.characterBubble, { borderColor: character.color }]}>
          <Text style={styles.characterEmoji}>{character.emoji}</Text>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{character.introLine}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.bottomPanel}>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <Text style={styles.characterName}>{character.name}</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => router.replace(`/mission/${mission.id}/story`)}>
            <Text style={styles.startBtnText}>Start Mission →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={() => router.back()}>
            <Text style={styles.skipBtnText}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, justifyContent: 'space-between', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  characterBubble: { alignItems: 'center', marginTop: 40 },
  characterEmoji: { fontSize: 100, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8 },
  speechBubble: { backgroundColor: THEME.white, borderRadius: 20, padding: 16, marginTop: 16, maxWidth: '90%', borderWidth: 3, borderColor: THEME.sunshineYellow },
  speechText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.deepNavy, textAlign: 'center', lineHeight: 22 },
  bottomPanel: { backgroundColor: 'rgba(29,53,87,0.9)', borderRadius: 24, padding: 24, alignItems: 'center' },
  missionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, color: THEME.white, textAlign: 'center' },
  characterName: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.sunshineYellow, marginTop: 4, marginBottom: 16 },
  startBtn: { backgroundColor: THEME.tropicalTeal, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  startBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
  skipBtn: { marginTop: 12, padding: 8 },
  skipBtnText: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.white, opacity: 0.7 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

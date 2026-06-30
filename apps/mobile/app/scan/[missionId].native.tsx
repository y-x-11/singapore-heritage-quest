import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/authStore';
import { MISSIONS, parseQrPayload, THEME } from '@/lib/data';

export default function ScanScreen() {
  const { missionId } = useLocalSearchParams<{ missionId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const updateProgress = useAuthStore((s) => s.updateProgress);
  const router = useRouter();

  const mission = MISSIONS.find((m) => m.id === missionId);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !mission) return;
    setScanned(true);

    const payload = parseQrPayload(data);
    if (!payload || payload.missionId !== mission.id) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Wrong Card!', 'This heritage card doesn\'t match this mission. Try another card.', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateProgress(mission.id, mission.locationId, 'unlocked');
    router.replace(`/ar/${mission.id}`);
  };

  const simulateScan = async () => {
    if (!mission || scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateProgress(mission.id, mission.locationId, 'unlocked');
    router.replace(`/ar/${mission.id}`);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera permission is needed to scan heritage cards</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={simulateScan}>
          <Text style={styles.btnText}>Simulate Scan (Demo)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.close} onPress={() => router.back()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Scan Heritage Card</Text>
          <Text style={styles.subtitle}>{mission?.title ?? 'Point at QR code'}</Text>

          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>

          <Text style={styles.hint}>Align the QR code within the frame</Text>

          <TouchableOpacity style={styles.simBtn} onPress={simulateScan}>
            <Text style={styles.simBtnText}>🧪 Simulate Scan (Demo)</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  close: { position: 'absolute', top: 56, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#FFF', fontSize: 20 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: THEME.white, marginBottom: 4 },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.white, opacity: 0.8, marginBottom: 32 },
  scanFrame: { width: 240, height: 240, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: THEME.sunshineYellow },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  hint: { fontFamily: 'Quicksand_500Medium', fontSize: 13, color: THEME.white, opacity: 0.7, marginTop: 24 },
  simBtn: { position: 'absolute', bottom: 48, backgroundColor: THEME.tropicalTeal, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  simBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: THEME.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: THEME.softCream },
  message: { fontFamily: 'Quicksand_500Medium', fontSize: 16, color: THEME.deepNavy, textAlign: 'center', marginBottom: 20 },
  btn: { backgroundColor: THEME.tropicalTeal, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginBottom: 12 },
  btnSecondary: { backgroundColor: THEME.deepNavy },
  btnText: { fontFamily: 'Nunito_700Bold', color: THEME.white },
});

import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { GradientHeader } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { LOCATIONS, haversineDistanceMeters, PROXIMITY_RADIUS_METERS, THEME } from '@/lib/data';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const updateProgress = useAuthStore((s) => s.updateProgress);
  const progress = useAuthStore((s) => s.progress);
  const router = useRouter();

  const checkProximity = useCallback(
    async (lat: number, lng: number) => {
      for (const loc of LOCATIONS) {
        const dist = haversineDistanceMeters(lat, lng, loc.lat, loc.lng);
        if (dist <= PROXIMITY_RADIUS_METERS) {
          if (nearbyId !== loc.id) {
            setNearbyId(loc.id);
            const alreadyDiscovered = progress.some((p) => p.locationId === loc.id && p.status !== 'locked');
            if (!alreadyDiscovered) {
              await updateProgress(`discover_${loc.id}`, loc.id, 'discovered');
              Alert.alert('Zone Discovered! 🎉', `You're near ${loc.name}! Tap the pin to explore.`);
            }
          }
          return;
        }
      }
      setNearbyId(null);
    },
    [nearbyId, progress, updateProgress]
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location needed', 'Enable location to discover heritage zones near you.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setUserLocation(coords);
      checkProximity(coords.lat, coords.lng);

      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 20 },
        (update) => {
          const c = { lat: update.coords.latitude, lng: update.coords.longitude };
          setUserLocation(c);
          checkProximity(c.lat, c.lng);
        }
      );
      return () => sub.remove();
    })();
  }, []);

  const initialRegion = {
    latitude: 1.295,
    longitude: 103.852,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Heritage Map" subtitle="Discover zones across Singapore" colors={[THEME.purple, THEME.tropicalTeal]} />

      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {LOCATIONS.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.lat, longitude: loc.lng }}
            title={loc.name}
            description={loc.description}
            onPress={() => router.push(`/location/${loc.id}`)}
          >
            <View style={[styles.marker, { backgroundColor: loc.color, borderColor: nearbyId === loc.id ? THEME.sunshineYellow : loc.color }]}>
              <Text style={styles.markerEmoji}>{loc.emoji}</Text>
            </View>
          </Marker>
        ))}
        {LOCATIONS.map((loc) => (
          <Circle
            key={`circle-${loc.id}`}
            center={{ latitude: loc.lat, longitude: loc.lng }}
            radius={PROXIMITY_RADIUS_METERS}
            fillColor={loc.color + '22'}
            strokeColor={loc.color + '66'}
            strokeWidth={1}
          />
        ))}
      </MapView>

      {nearbyId && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>
            📍 You're near {LOCATIONS.find((l) => l.id === nearbyId)?.name}! Tap the pin to explore.
          </Text>
        </View>
      )}

      {!userLocation && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>💡 Tip: Use simulator location override to test proximity near Chinatown (1.2834, 103.8444)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  map: { flex: 1 },
  marker: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  markerEmoji: { fontSize: 22 },
  toast: { position: 'absolute', bottom: 24, left: 20, right: 20, backgroundColor: THEME.deepNavy, borderRadius: 16, padding: 14 },
  toastText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 13, color: THEME.white, textAlign: 'center' },
  hint: { position: 'absolute', bottom: 24, left: 20, right: 20, backgroundColor: THEME.white, borderRadius: 12, padding: 12, opacity: 0.95 },
  hintText: { fontFamily: 'Quicksand_500Medium', fontSize: 11, color: THEME.deepNavy, textAlign: 'center' },
});

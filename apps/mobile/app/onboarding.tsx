import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { THEME } from '@/lib/data';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🗺️',
    title: 'Explore Heritage Zones',
    description: 'Walk through Chinatown, Little India, and Kampong Glam. Discover Singapore\'s rich cultural history!',
    colors: [THEME.merlionRed, '#FF6B6B'],
  },
  {
    emoji: '📷',
    title: 'Scan Heritage Cards',
    description: 'Find QR cards at each location and scan them to meet AR characters from Singapore\'s past!',
    colors: [THEME.tropicalTeal, '#44CFAE'],
  },
  {
    emoji: '🏆',
    title: 'Earn Badges & XP',
    description: 'Complete missions, ace quizzes, and collect heritage treasures. Level up your explorer rank!',
    colors: [THEME.sunshineYellow, THEME.heritageGold],
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <LinearGradient colors={item.colors} style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </LinearGradient>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>{index === SLIDES.length - 1 ? "Let's Go!" : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream },
  skip: { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  skipText: { fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.deepNavy, opacity: 0.6 },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 100 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: THEME.white, textAlign: 'center', marginBottom: 16 },
  description: { fontFamily: 'Quicksand_500Medium', fontSize: 16, color: THEME.white, textAlign: 'center', lineHeight: 24, opacity: 0.95 },
  footer: { padding: 24, paddingBottom: 48 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D0C8BE' },
  dotActive: { width: 24, backgroundColor: THEME.tropicalTeal },
  button: { backgroundColor: THEME.deepNavy, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: THEME.white },
});

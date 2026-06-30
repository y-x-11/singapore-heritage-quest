import { View, ActivityIndicator } from 'react-native';
import { THEME } from '@/lib/data';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.softCream }}>
      <ActivityIndicator size="large" color={THEME.tropicalTeal} />
    </View>
  );
}

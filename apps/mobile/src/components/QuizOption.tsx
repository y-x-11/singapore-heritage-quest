import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { THEME } from '@/lib/data';

interface QuizOptionProps {
  label: string;
  index: number;
  selected: boolean;
  correct?: boolean;
  showResult: boolean;
  onPress: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizOption({ label, index, selected, correct, showResult, onPress }: QuizOptionProps) {
  let borderColor = '#E8E0D5';
  let bg = THEME.white;
  if (showResult && selected) {
    borderColor = correct ? THEME.success : THEME.error;
    bg = correct ? '#E8FFF5' : '#FFF0F3';
  } else if (showResult && correct) {
    borderColor = THEME.success;
    bg = '#E8FFF5';
  } else if (selected) {
    borderColor = THEME.tropicalTeal;
    bg = '#E8F8F5';
  }

  return (
    <TouchableOpacity
      style={[styles.option, { borderColor, backgroundColor: bg }]}
      onPress={onPress}
      disabled={showResult}
      activeOpacity={0.8}
    >
      <View style={[styles.letter, { backgroundColor: borderColor }]}>
        <Text style={styles.letterText}>{LETTERS[index]}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  letter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: THEME.white },
  label: { flex: 1, fontFamily: 'Quicksand_600SemiBold', fontSize: 15, color: THEME.deepNavy },
});

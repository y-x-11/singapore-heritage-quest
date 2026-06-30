import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { QuizOption, ConfettiOverlay } from '@/components';
import { MISSIONS, QUIZZES, THEME } from '@/lib/data';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const mission = MISSIONS.find((m) => m.id === id);
  const quiz = QUIZZES.find((q) => q.id === mission?.quizId);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!quiz || !mission) {
    return (
      <View style={styles.center}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  const question = quiz.questions[qIndex];
  const isLast = qIndex === quiz.questions.length - 1;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const correct = index === question.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      setShowConfetti(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const pct = Math.round((score / quiz.questions.length) * 100);
      router.replace({ pathname: `/mission/${mission.id}/reward`, params: { score: String(score), total: String(quiz.questions.length), pct: String(pct) } });
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <View style={styles.container}>
      <ConfettiOverlay active={showConfetti} />

      <View style={styles.progress}>
        {quiz.questions.map((_, i) => (
          <View key={i} style={[styles.dot, i <= qIndex && styles.dotActive, i < qIndex && styles.dotDone]} />
        ))}
      </View>

      <Text style={styles.counter}>Question {qIndex + 1} of {quiz.questions.length}</Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((opt, i) => (
          <QuizOption
            key={i}
            label={opt}
            index={i}
            selected={selected === i}
            correct={i === question.correctIndex}
            showResult={showResult}
            onPress={() => handleSelect(i)}
          />
        ))}
      </View>

      {showResult && (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackText, selected === question.correctIndex ? styles.correct : styles.wrong]}>
            {selected === question.correctIndex ? '✅ Correct!' : '❌ Not quite!'}
          </Text>
          <Text style={styles.explanation}>{question.explanation}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{isLast ? 'See Rewards! 🎉' : 'Next Question →'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.softCream, paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progress: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: THEME.tropicalTeal },
  dotDone: { backgroundColor: THEME.success },
  counter: { fontFamily: 'Quicksand_600SemiBold', fontSize: 13, color: THEME.tropicalTeal, marginBottom: 8 },
  question: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: THEME.deepNavy, lineHeight: 30, marginBottom: 24 },
  options: { flex: 1 },
  feedback: { paddingBottom: 40 },
  feedbackText: { fontFamily: 'Nunito_700Bold', fontSize: 18, marginBottom: 8 },
  correct: { color: THEME.success },
  wrong: { color: THEME.error },
  explanation: { fontFamily: 'Quicksand_500Medium', fontSize: 14, color: THEME.deepNavy, opacity: 0.7, lineHeight: 20, marginBottom: 16 },
  nextBtn: { backgroundColor: THEME.tropicalTeal, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: THEME.white },
});

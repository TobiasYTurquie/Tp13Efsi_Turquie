import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Feedback() {
  const { feedback } = useGame();

  if (!feedback) return null;

  const isCorrect = feedback.type === 'correct';
  const isTimeout = feedback.type === 'timeout';

  return (
    <View
      style={[
        styles.container,
        isCorrect ? styles.correct : isTimeout ? styles.timeout : styles.wrong,
      ]}
    >
      <Text style={styles.text}>{feedback.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  correct: { backgroundColor: '#1b5e20' },
  wrong: { backgroundColor: '#7f0000' },
  timeout: { backgroundColor: '#333' },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

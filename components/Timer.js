import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Timer() {
  const { timer } = useGame();

  function getColor() {
    if (timer > 10) return '#4CAF50';
    if (timer > 5) return '#FF9800';
    return '#F44336';
  }

  const color = getColor();

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={styles.icon}>⏱</Text>
      <Text style={[styles.timer, { color }]}>{timer}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2a3a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  timer: {
    fontSize: 22,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
});

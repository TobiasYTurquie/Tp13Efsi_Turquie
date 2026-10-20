import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ScoreBoard() {
  const { score, playerName } = useGame();
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        👤 {playerName || 'Jugador'}
      </Text>
      <View style={styles.scoreBox}>
        <Text style={styles.label}>Puntaje</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
  },
  name: {
    color: '#8ab',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: '#1e2a3a',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  label: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  score: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

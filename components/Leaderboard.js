import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { ranking } = useGame();

  if (ranking.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aún no hay partidas registradas.</Text>
      </View>
    );
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <FlatList
      data={ranking}
      keyExtractor={(_, i) => String(i)}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <View style={[styles.row, index === 0 && styles.firstRow]}>
          <Text style={styles.medal}>
            {medals[index] !== undefined ? medals[index] : `${index + 1}.`}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.score}>{item.score} pts</Text>
        </View>
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2a3a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  firstRow: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  medal: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  score: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
    fontStyle: 'italic',
  },
});

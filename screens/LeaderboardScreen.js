import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useGame } from '../context/GameContext';
import Leaderboard from '../components/Leaderboard';

export default function LeaderboardScreen() {
  const { setScreen } = useGame();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.sub}>Mejores puntajes de todos los jugadores</Text>

        <Leaderboard />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setScreen('home')}
          activeOpacity={0.85}
        >
          <Text style={styles.backText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d1b2a',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sub: {
    color: '#8ab',
    fontSize: 14,
    marginBottom: 28,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
  },
  backText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

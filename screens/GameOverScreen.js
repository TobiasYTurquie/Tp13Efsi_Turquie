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

export default function GameOverScreen() {
  const { score, playerName, resetGame, setScreen, gameMode } = useGame();

  const modeLabel =
    gameMode === 'capitals' ? 'Modo Capitales' : 'Adivinar Banderas';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>🎮</Text>
        <Text style={styles.title}>Fin del juego</Text>
        <Text style={styles.mode}>{modeLabel}</Text>
        <Text style={styles.player}>{playerName}</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Tu puntaje final</Text>
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scorePts}>puntos</Text>
        </View>

        <Text style={styles.rankingTitle}>🏆 Tabla de posiciones</Text>
        <Leaderboard />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.replayBtn}
            onPress={resetGame}
            activeOpacity={0.85}
          >
            <Text style={styles.replayText}>🔄 Volver a jugar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rankingBtn}
            onPress={() => setScreen('leaderboard')}
            activeOpacity={0.85}
          >
            <Text style={styles.rankingBtnText}>Ver ranking completo</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  mode: {
    color: '#4A90E2',
    fontSize: 14,
    marginBottom: 4,
  },
  player: {
    color: '#8ab',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  scoreBox: {
    backgroundColor: '#1e2a3a',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  scoreLabel: {
    color: '#8ab',
    fontSize: 14,
    marginBottom: 8,
  },
  scoreNum: {
    color: '#4A90E2',
    fontSize: 56,
    fontWeight: 'bold',
  },
  scorePts: {
    color: '#8ab',
    fontSize: 16,
  },
  rankingTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  replayBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  replayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  rankingBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
  },
  rankingBtnText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

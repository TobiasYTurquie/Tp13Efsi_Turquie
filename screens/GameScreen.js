import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useGame } from '../context/GameContext';
import Flag from '../components/Flag';
import GuessForm from '../components/GuessForm';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import HintButton from '../components/HintButton';
import HintDisplay from '../components/HintDisplay';
import Feedback from '../components/Feedback';

export default function GameScreen() {
  const { currentCountry, gameMode, resetGame } = useGame();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <ScoreBoard />
        </View>

        <View style={styles.timerRow}>
          <Timer />
          <TouchableOpacity
            onPress={resetGame}
            style={styles.exitBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.exitText}>✕ Salir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            {gameMode === 'capitals'
              ? '¿Cuál es la capital de este país?'
              : '¿De qué país es esta bandera?'}
          </Text>
          {gameMode === 'capitals' && currentCountry && (
            <Text style={styles.countryName}>{currentCountry.name}</Text>
          )}
        </View>

        <Flag />

        <Feedback />
        <HintDisplay />

        <View style={styles.formArea}>
          <GuessForm />
        </View>

        <HintButton />
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
    padding: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    marginBottom: 14,
  },
  timerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  exitBtn: {
    backgroundColor: '#1a0a0a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  exitText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  countryName: {
    color: '#4A90E2',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },
  formArea: {
    width: '100%',
    marginBottom: 12,
  },
});

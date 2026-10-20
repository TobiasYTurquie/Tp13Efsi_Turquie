import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function HomeScreen() {
  const { loading, error, countries, startGame, setScreen } = useGame();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  function handleStart(mode) {
    if (!name.trim()) {
      setNameError('Por favor ingresá tu nombre.');
      return;
    }
    if (countries.length === 0) {
      setNameError('Los datos aún no terminaron de cargar.');
      return;
    }
    setNameError('');
    startGame(name.trim(), mode);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.emoji}>🌍</Text>
        <Text style={styles.title}>Flag Quiz</Text>
        <Text style={styles.subtitle}>Adivina banderas y capitales</Text>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Cargando países desde la API...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tu nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu nombre..."
                placeholderTextColor="#555"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setNameError('');
                }}
                maxLength={30}
                autoCorrect={false}
                autoCapitalize="words"
              />
              {nameError ? (
                <Text style={styles.nameError}>{nameError}</Text>
              ) : null}
            </View>

            <Text style={styles.modeTitle}>Elegí un modo de juego</Text>

            <TouchableOpacity
              style={styles.modeBtnFlags}
              onPress={() => handleStart('flags')}
              activeOpacity={0.85}
            >
              <Text style={styles.modeBtnIcon}>🏳️</Text>
              <View style={styles.modeBtnInfo}>
                <Text style={styles.modeBtnTitle}>Adivinar Banderas</Text>
                <Text style={styles.modeBtnDesc}>
                  Escribí el nombre del país de cada bandera
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeBtnCapitals}
              onPress={() => handleStart('capitals')}
              activeOpacity={0.85}
            >
              <Text style={styles.modeBtnIcon}>🏛️</Text>
              <View style={styles.modeBtnInfo}>
                <Text style={styles.modeBtnTitle}>Modo Capitales</Text>
                <Text style={styles.modeBtnDesc}>
                  Elegí la capital correcta entre 3 opciones
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rankingBtn}
              onPress={() => setScreen('leaderboard')}
              activeOpacity={0.8}
            >
              <Text style={styles.rankingBtnText}>🏆 Ver Ranking</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✅ {countries.length} países cargados
              </Text>
              <Text style={styles.infoText}>⏱ 15 segundos por bandera</Text>
              <Text style={styles.infoText}>
                🎯 +10 pts + segundos restantes por acierto
              </Text>
              <Text style={styles.infoText}>💡 Las pistas cuestan 2 segundos</Text>
            </View>
          </>
        )}
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
    paddingTop: 48,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#8ab',
    marginBottom: 36,
  },
  loadingBox: {
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
  },
  loadingText: {
    color: '#8ab',
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: '#3b0000',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    color: '#8ab',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e2a3a',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
  },
  nameError: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 6,
  },
  modeTitle: {
    color: '#8ab',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 12,
    fontWeight: '600',
  },
  modeBtnFlags: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a5c',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#2a5a8c',
  },
  modeBtnCapitals: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1a4a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#4a2a7a',
  },
  modeBtnIcon: {
    fontSize: 36,
  },
  modeBtnInfo: {
    flex: 1,
  },
  modeBtnTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeBtnDesc: {
    color: '#8ab',
    fontSize: 13,
    lineHeight: 18,
  },
  rankingBtn: {
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  rankingBtnText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#1e2a3a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 8,
  },
  infoText: {
    color: '#8ab',
    fontSize: 13,
  },
});

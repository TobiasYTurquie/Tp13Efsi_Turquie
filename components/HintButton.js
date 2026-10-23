import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function HintButton() {
  const {
    useHint,
    timer,
    gameOver,
    gameMode,
    capitalOptions,
    eliminatedOptions,
    currentCountry,
    revealedLetters,
    feedback,
    HINT_PENALTY = 2,
  } = useGame();

  const noHintsLeft =
    gameMode === 'capitals'
      ? (capitalOptions ? capitalOptions.filter(o => !eliminatedOptions.includes(o)).length <= 1 : true)
      : currentCountry
      ? (currentCountry.name.replace(/\s+/g, '').length - revealedLetters.length) <= 0
      : true;

  const isDisabled = gameOver || timer === 0 || !!feedback || noHintsLeft;

  function getLabel() {
    if (gameMode === 'capitals') {
      if (!capitalOptions) return '🔍 Pista';
      const available = capitalOptions.filter(
        o => !eliminatedOptions.includes(o)
      );
      if (available.length <= 1) return '🔍 Sin pistas';
      return `🔍 Eliminar opción (-${HINT_PENALTY}s)`;
    }
    if (!currentCountry) return '💡 Pista';
    const name = currentCountry.name;
    let letterCount = 0;
    for (let i = 0; i < name.length; i++) {
      if (name[i] !== ' ') letterCount++;
    }
    const unrevealed = letterCount - revealedLetters.length;
    if (unrevealed <= 0) return '💡 Sin pistas';
    return `💡 Pista (-${HINT_PENALTY}s)`;
  }

  return (
    <TouchableOpacity
      style={[styles.btn, isDisabled && styles.disabled]}
      onPress={useHint}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{getLabel()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#5c3a7e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
  },
  disabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

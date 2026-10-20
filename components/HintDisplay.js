import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function HintDisplay() {
  const { currentCountry, revealedLetters, gameMode } = useGame();

  if (gameMode !== 'flags' || !currentCountry || revealedLetters.length === 0) {
    return null;
  }

  const name = currentCountry.name;

  let letterIndex = 0;
  const chars = name.split('').map((char, i) => {
    if (char === ' ') {
      return { char: ' ', revealed: true, isSpace: true, key: `space-${i}` };
    }
    const current = letterIndex;
    letterIndex++;
    return {
      char,
      revealed: revealedLetters.includes(current),
      isSpace: false,
      key: `letter-${i}`,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pista:</Text>
      <View style={styles.row}>
        {chars.map(c =>
          c.isSpace ? (
            <View key={c.key} style={styles.space} />
          ) : (
            <View key={c.key} style={styles.letterBox}>
              <Text style={styles.letter}>{c.revealed ? c.char : '_'}</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  label: {
    color: '#8ab',
    fontSize: 13,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  letterBox: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    minWidth: 18,
    alignItems: 'center',
    paddingBottom: 2,
    marginHorizontal: 1,
  },
  space: {
    minWidth: 12,
  },
  letter: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

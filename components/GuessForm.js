import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function GuessForm() {
  const {
    guess,
    guessCapital,
    gameMode,
    capitalOptions,
    eliminatedOptions,
    currentCountry,
    timer,
    feedback,
  } = useGame();
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput('');
  }, [currentCountry]);

  const isDisabled = timer === 0 || !!feedback;

  if (gameMode === 'capitals') {
    return (
      <View style={styles.optionsContainer}>
        {capitalOptions.map((option, idx) => {
          const isEliminated = eliminatedOptions.includes(option);
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionBtn,
                isEliminated && styles.optionEliminated,
                isDisabled && !isEliminated && styles.optionDisabled,
              ]}
              onPress={() => !isEliminated && !isDisabled && guessCapital(option)}
              disabled={isEliminated || isDisabled}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.optionText,
                  isEliminated && styles.optionEliminatedText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={styles.flagForm}>
        <TextInput
          style={[styles.input, isDisabled && styles.inputDisabled]}
          placeholder="Escribe el nombre del país..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          editable={!isDisabled}
          onSubmitEditing={() => {
            if (input.trim()) {
              guess(input);
              setInput('');
            }
          }}
        />
        <TouchableOpacity
          style={[styles.submitBtn, isDisabled && styles.disabledBtn]}
          onPress={() => {
            if (input.trim()) {
              guess(input);
              setInput('');
            }
          }}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Responder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  flagForm: {
    width: '100%',
    gap: 10,
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
  inputDisabled: {
    borderColor: '#444',
    opacity: 0.6,
  },
  submitBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    backgroundColor: '#1e2a3a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  optionEliminated: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    opacity: 0.4,
  },
  optionDisabled: {
    opacity: 0.7,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  optionEliminatedText: {
    color: '#555',
    textDecorationLine: 'line-through',
  },
});

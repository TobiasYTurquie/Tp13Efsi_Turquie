import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './context/GameContext';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Navigation />
    </GameProvider>
  );
}

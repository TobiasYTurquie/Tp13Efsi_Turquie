import React from 'react';
import { useGame } from '../context/GameContext';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import GameOverScreen from '../screens/GameOverScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

export default function Navigation() {
  const { screen } = useGame();

  if (screen === 'home') return <HomeScreen />;
  if (screen === 'game') return <GameScreen />;
  if (screen === 'gameover') return <GameOverScreen />;
  if (screen === 'leaderboard') return <LeaderboardScreen />;
  return <HomeScreen />;
}

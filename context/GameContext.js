import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext(null);

const FLAGS_API = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_API = 'https://countriesnow.space/api/v0.1/countries/capital';

const TIMER_SECONDS = 15;
const HINT_PENALTY = 2;
const CORRECT_POINTS = 10;
const WRONG_POINTS = -1;
const RANKING_KEY = 'FLAG_GAME_RANKING';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function GameProvider({ children }) {
  const [screen, setScreen] = useState('home');
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState('flags');

  const [countries, setCountries] = useState([]);
  const [capitalsMap, setCapitalsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [revealedLetters, setRevealedLetters] = useState([]);
  const [capitalOptions, setCapitalOptions] = useState([]);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);

  const [ranking, setRanking] = useState([]);

  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const currentCountryRef = useRef(null);
  const gameModeRef = useRef('flags');
  const countriesRef = useRef([]);
  const capitalsMapRef = useRef({});

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { currentCountryRef.current = currentCountry; }, [currentCountry]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);
  useEffect(() => { countriesRef.current = countries; }, [countries]);
  useEffect(() => { capitalsMapRef.current = capitalsMap; }, [capitalsMap]);

  useEffect(() => {
    loadRanking();
    fetchData();
    return () => stopTimer();
  }, []);

  async function loadRanking() {
    try {
      const stored = await AsyncStorage.getItem(RANKING_KEY);
      if (stored) setRanking(JSON.parse(stored));
    } catch (e) {}
  }

  async function saveRanking(newEntry) {
    try {
      const stored = await AsyncStorage.getItem(RANKING_KEY);
      let list = stored ? JSON.parse(stored) : [];
      const existingIndex = list.findIndex(r => r.name === newEntry.name);
      if (existingIndex >= 0) {
        if (newEntry.score > list[existingIndex].score) {
          list[existingIndex].score = newEntry.score;
        }
      } else {
        list.push(newEntry);
      }
      list.sort((a, b) => b.score - a.score);
      await AsyncStorage.setItem(RANKING_KEY, JSON.stringify(list));
      setRanking(list);
    } catch (e) {}
  }

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [flagsRes, capsRes] = await Promise.all([
        fetch(FLAGS_API),
        fetch(CAPITALS_API),
      ]);
      const flagsJson = await flagsRes.json();
      const capsJson = await capsRes.json();

      if (flagsJson.error || !flagsJson.data) {
        throw new Error('No se pudieron cargar las banderas.');
      }

      const validCountries = flagsJson.data.filter(c => c.flag && c.name);
      setCountries(validCountries);
      countriesRef.current = validCountries;

      if (!capsJson.error && capsJson.data) {
        const map = {};
        capsJson.data.forEach(c => {
          if (c.name && c.capital && c.capital.trim() !== '') {
            map[c.name] = c.capital;
          }
        });
        setCapitalsMap(map);
        capitalsMapRef.current = map;
      }

      setLoading(false);
    } catch (e) {
      setError('Error al cargar los datos. Verificá tu conexión a internet.');
      setLoading(false);
    }
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer() {
    stopTimer();
    setTimer(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          if (!gameOverRef.current) {
            handleTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleTimeout() {
    if (gameOverRef.current) return;
    setFeedback({ type: 'timeout', message: '¡Tiempo agotado!' });
    stopTimer();
    setTimeout(() => {
      endGame();
    }, 1500);
  }

  function endGame() {
    stopTimer();
    setGameOver(true);
    gameOverRef.current = true;
    const finalScore = scoreRef.current;
    const name = playerName || 'Anónimo';
    if (name.trim()) {
      saveRanking({ name: name.trim(), score: finalScore });
    }
    setScreen('gameover');
  }

  function pickNextCountry(mode, capMap, countryList) {
    const currentName = currentCountryRef.current ? currentCountryRef.current.name : null;
    if (mode === 'capitals') {
      const available = countryList.filter(c => capMap[c.name]);
      if (available.length === 0) return null;
      let next = available[Math.floor(Math.random() * available.length)];
      let attempts = 0;
      while (next.name === currentName && available.length > 1 && attempts < 20) {
        next = available[Math.floor(Math.random() * available.length)];
        attempts++;
      }
      return next;
    } else {
      if (countryList.length === 0) return null;
      let next = countryList[Math.floor(Math.random() * countryList.length)];
      let attempts = 0;
      while (next.name === currentName && countryList.length > 1 && attempts < 20) {
        next = countryList[Math.floor(Math.random() * countryList.length)];
        attempts++;
      }
      return next;
    }
  }

  function generateCapitalOptions(country, capMap, countryList) {
    const correct = capMap[country.name];
    const others = Object.values(capMap).filter(cap => cap !== correct);
    const shuffledOthers = shuffle(others);
    const wrong = shuffledOthers.slice(0, 2);
    return shuffle([correct, ...wrong]);
  }

  function nextCountry() {
    const mode = gameModeRef.current;
    const capMap = capitalsMapRef.current;
    const countryList = countriesRef.current;
    const next = pickNextCountry(mode, capMap, countryList);
    if (!next) return;
    setCurrentCountry(next);
    currentCountryRef.current = next;
    setRevealedLetters([]);
    setFeedback(null);
    setEliminatedOptions([]);
    if (mode === 'capitals') {
      const opts = generateCapitalOptions(next, capMap, countryList);
      setCapitalOptions(opts);
    }
    startTimer();
  }

  function startGame(name, mode) {
    setPlayerName(name);
    setGameMode(mode);
    gameModeRef.current = mode;
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setFeedback(null);
    setRevealedLetters([]);
    setEliminatedOptions([]);

    const capMap = capitalsMapRef.current;
    const countryList = countriesRef.current;
    const firstCountry = pickNextCountry(mode, capMap, countryList);
    if (!firstCountry) return;

    setCurrentCountry(firstCountry);
    currentCountryRef.current = firstCountry;

    if (mode === 'capitals') {
      const opts = generateCapitalOptions(firstCountry, capMap, countryList);
      setCapitalOptions(opts);
    }

    setScreen('game');
    setTimeout(() => startTimer(), 50);
  }

  function normalizeStr(str) {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function guess(answer) {
    if (gameOverRef.current || !currentCountryRef.current) return;
    const correct = normalizeStr(currentCountryRef.current.name);
    const given = normalizeStr(answer);
    if (correct === given) {
      const bonus = timer;
      const gained = CORRECT_POINTS + bonus;
      setScore(prev => prev + gained);
      scoreRef.current += gained;
      setFeedback({ type: 'correct', message: `¡Correcto! +${gained} puntos` });
      stopTimer();
      setTimeout(() => {
        setFeedback(null);
        nextCountry();
      }, 1200);
    } else {
      const newScore = Math.max(0, scoreRef.current + WRONG_POINTS);
      setScore(newScore);
      scoreRef.current = newScore;
      setFeedback({ type: 'wrong', message: 'Incorrecto. -1 punto' });
      setTimeout(() => setFeedback(null), 1000);
    }
  }

  function guessCapital(capital) {
    if (gameOverRef.current || !currentCountryRef.current) return;
    const correct = capitalsMapRef.current[currentCountryRef.current.name];
    if (capital === correct) {
      const bonus = timer;
      const gained = CORRECT_POINTS + bonus;
      setScore(prev => prev + gained);
      scoreRef.current += gained;
      setFeedback({ type: 'correct', message: `¡Correcto! +${gained} puntos` });
      stopTimer();
      setTimeout(() => {
        setFeedback(null);
        nextCountry();
      }, 1200);
    } else {
      const newScore = Math.max(0, scoreRef.current + WRONG_POINTS);
      setScore(newScore);
      scoreRef.current = newScore;
      setFeedback({ type: 'wrong', message: 'Incorrecto. -1 punto' });
      setTimeout(() => setFeedback(null), 1000);
    }
  }

  function useHint() {
    if (gameOverRef.current || !currentCountryRef.current) return;

    if (gameModeRef.current === 'flags') {
      const name = currentCountryRef.current.name;
      let letterIndex = 0;
      const allIndices = [];
      for (let i = 0; i < name.length; i++) {
        if (name[i] !== ' ') {
          allIndices.push(letterIndex);
          letterIndex++;
        }
      }
      setRevealedLetters(prev => {
        const unrevealed = allIndices.filter(idx => !prev.includes(idx));
        if (unrevealed.length === 0) return prev;
        const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        return [...prev, pick];
      });
      setTimer(prev => {
        const next = Math.max(0, prev - HINT_PENALTY);
        if (next === 0) {
          stopTimer();
          setTimeout(() => handleTimeout(), 50);
        }
        return next;
      });
    } else {
      setCapitalOptions(opts => {
        const correct = capitalsMapRef.current[currentCountryRef.current.name];
        setEliminatedOptions(prev => {
          const available = opts.filter(o => o !== correct && !prev.includes(o));
          if (available.length === 0) return prev;
          const toEliminate = available[Math.floor(Math.random() * available.length)];
          return [...prev, toEliminate];
        });
        return opts;
      });
    }
  }

  function resetGame() {
    stopTimer();
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setCurrentCountry(null);
    currentCountryRef.current = null;
    setFeedback(null);
    setRevealedLetters([]);
    setEliminatedOptions([]);
    setCapitalOptions([]);
    setScreen('home');
  }

  const value = {
    screen,
    setScreen,
    playerName,
    setPlayerName,
    gameMode,
    countries,
    capitalsMap,
    loading,
    error,
    currentCountry,
    score,
    timer,
    gameOver,
    feedback,
    revealedLetters,
    capitalOptions,
    eliminatedOptions,
    ranking,
    startGame,
    guess,
    guessCapital,
    nextCountry,
    useHint,
    resetGame,
    endGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider');
  return ctx;
}

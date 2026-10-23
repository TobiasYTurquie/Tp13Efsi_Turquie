import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext(null);

const FLAGS_API = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_API = 'https://countriesnow.space/api/v0.1/countries/capital';

export const TIMER_SECONDS = 15;
export const HINT_PENALTY = 2;
export const CORRECT_POINTS = 10;
export const WRONG_POINTS = -1;
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
  const timeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const timerValueRef = useRef(TIMER_SECONDS);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const feedbackRef = useRef(null);
  const currentCountryRef = useRef(null);
  const gameModeRef = useRef('flags');
  const countriesRef = useRef([]);
  const capitalsMapRef = useRef({});

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
  useEffect(() => { currentCountryRef.current = currentCountry; }, [currentCountry]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);
  useEffect(() => { countriesRef.current = countries; }, [countries]);
  useEffect(() => { capitalsMapRef.current = capitalsMap; }, [capitalsMap]);
  useEffect(() => { timerValueRef.current = timer; }, [timer]);

  useEffect(() => {
    loadRanking();
    fetchData();
    return () => {
      stopTimer();
      clearAllTimeouts();
    };
  }, []);

  function clearAllTimeouts() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }

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
    timerValueRef.current = TIMER_SECONDS;
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          stopTimer();
          timerValueRef.current = 0;
          if (!gameOverRef.current) {
            handleTimeout();
          }
          return 0;
        }
        const nextVal = prev - 1;
        timerValueRef.current = nextVal;
        // Auto-hint for capitals mode: every 5 seconds (at 10s and 5s countdown marks)
        if (gameModeRef.current === 'capitals' && (nextVal === 10 || nextVal === 5)) {
          eliminateCapitalOption();
        }
        return nextVal;
      });
    }, 1000);
  }

  function handleTimeout() {
    if (gameOverRef.current) return;
    stopTimer();
    clearAllTimeouts();
    const fb = { type: 'timeout', message: '¡Tiempo agotado!' };
    setFeedback(fb);
    feedbackRef.current = fb;
    timeoutRef.current = setTimeout(() => {
      endGame();
    }, 1500);
  }

  function endGame() {
    stopTimer();
    clearAllTimeouts();
    setGameOver(true);
    gameOverRef.current = true;
    setFeedback(null);
    feedbackRef.current = null;
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
    clearAllTimeouts();
    const mode = gameModeRef.current;
    const capMap = capitalsMapRef.current;
    const countryList = countriesRef.current;
    const next = pickNextCountry(mode, capMap, countryList);
    if (!next) return;
    setCurrentCountry(next);
    currentCountryRef.current = next;
    setRevealedLetters([]);
    setFeedback(null);
    feedbackRef.current = null;
    setEliminatedOptions([]);
    if (mode === 'capitals') {
      const opts = generateCapitalOptions(next, capMap, countryList);
      setCapitalOptions(opts);
    } else {
      setCapitalOptions([]);
    }
    startTimer();
  }

  function startGame(name, mode) {
    clearAllTimeouts();
    setPlayerName(name);
    setGameMode(mode);
    gameModeRef.current = mode;
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setFeedback(null);
    feedbackRef.current = null;
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
    } else {
      setCapitalOptions([]);
    }

    setScreen('game');
    timeoutRef.current = setTimeout(() => startTimer(), 50);
  }

  function normalizeStr(str) {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function guess(answer) {
    if (gameOverRef.current || !currentCountryRef.current || feedbackRef.current) return;
    const correct = normalizeStr(currentCountryRef.current.name);
    const given = normalizeStr(answer);
    if (correct === given) {
      const bonus = timerValueRef.current;
      const gained = CORRECT_POINTS + bonus;
      setScore(prev => prev + gained);
      scoreRef.current += gained;
      const fb = { type: 'correct', message: `¡Correcto! +${gained} puntos` };
      setFeedback(fb);
      feedbackRef.current = fb;
      stopTimer();
      clearAllTimeouts();
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        feedbackRef.current = null;
        nextCountry();
      }, 1200);
    } else {
      const newScore = Math.max(0, scoreRef.current + WRONG_POINTS);
      setScore(newScore);
      scoreRef.current = newScore;
      const fb = { type: 'wrong', message: 'Incorrecto. -1 punto' };
      setFeedback(fb);
      feedbackRef.current = fb;
      clearAllTimeouts();
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        feedbackRef.current = null;
      }, 1000);
    }
  }

  function guessCapital(capital) {
    if (gameOverRef.current || !currentCountryRef.current || feedbackRef.current) return;
    const correct = capitalsMapRef.current[currentCountryRef.current.name];
    if (capital === correct) {
      const bonus = timerValueRef.current;
      const gained = CORRECT_POINTS + bonus;
      setScore(prev => prev + gained);
      scoreRef.current += gained;
      const fb = { type: 'correct', message: `¡Correcto! +${gained} puntos` };
      setFeedback(fb);
      feedbackRef.current = fb;
      stopTimer();
      clearAllTimeouts();
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        feedbackRef.current = null;
        nextCountry();
      }, 1200);
    } else {
      const newScore = Math.max(0, scoreRef.current + WRONG_POINTS);
      setScore(newScore);
      scoreRef.current = newScore;
      const fb = { type: 'wrong', message: 'Incorrecto. -1 punto' };
      setFeedback(fb);
      feedbackRef.current = fb;
      clearAllTimeouts();
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        feedbackRef.current = null;
      }, 1000);
    }
  }

  function eliminateCapitalOption() {
    const current = currentCountryRef.current;
    if (!current) return false;
    const correct = capitalsMapRef.current[current.name];
    let didEliminate = false;

    setCapitalOptions(opts => {
      setEliminatedOptions(prev => {
        const availableWrong = opts.filter(o => o !== correct && !prev.includes(o));
        if (availableWrong.length === 0) return prev;
        const toEliminate = availableWrong[Math.floor(Math.random() * availableWrong.length)];
        didEliminate = true;
        return [...prev, toEliminate];
      });
      return opts;
    });

    return didEliminate;
  }

  function useHint() {
    if (gameOverRef.current || !currentCountryRef.current || feedbackRef.current) return;

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
      const unrevealed = allIndices.filter(idx => !revealedLetters.includes(idx));
      if (unrevealed.length === 0) return;

      const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      setRevealedLetters(prev => (prev.includes(pick) ? prev : [...prev, pick]));

      setTimer(prev => {
        const next = Math.max(0, prev - HINT_PENALTY);
        timerValueRef.current = next;
        if (next === 0) {
          stopTimer();
          clearAllTimeouts();
          timeoutRef.current = setTimeout(() => handleTimeout(), 50);
        }
        return next;
      });
    } else {
      const current = currentCountryRef.current;
      if (!current) return;
      const correct = capitalsMapRef.current[current.name];
      const remainingWrong = capitalOptions.filter(o => o !== correct && !eliminatedOptions.includes(o));
      if (remainingWrong.length === 0) return;

      eliminateCapitalOption();

      setTimer(prev => {
        const next = Math.max(0, prev - HINT_PENALTY);
        timerValueRef.current = next;
        if (next === 0) {
          stopTimer();
          clearAllTimeouts();
          timeoutRef.current = setTimeout(() => handleTimeout(), 50);
        }
        return next;
      });
    }
  }

  function resetScore() {
    setScore(0);
    scoreRef.current = 0;
  }

  function resetGame() {
    stopTimer();
    clearAllTimeouts();
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setCurrentCountry(null);
    currentCountryRef.current = null;
    setFeedback(null);
    feedbackRef.current = null;
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
    setGameMode,
    countries,
    capitalsMap,
    loading,
    error,
    currentCountry,
    score,
    setScore,
    resetScore,
    timer,
    setTimer,
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
    startTimer,
    stopTimer,
    loadRanking,
    saveRanking,
    TIMER_SECONDS,
    HINT_PENALTY,
    CORRECT_POINTS,
    WRONG_POINTS,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider');
  return ctx;
}

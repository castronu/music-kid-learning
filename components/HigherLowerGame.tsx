'use client';

import { useState, useCallback } from 'react';
import { audioEngine, NoteName, InstrumentType } from '@/lib/audioEngine';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'idle' | 'setup' | 'listening' | 'playing' | 'correct' | 'wrong';

const allNotes: NoteName[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];

const noteFrequencies: Record<NoteName, number> = {
  do: 261.63,
  re: 293.66,
  mi: 329.63,
  fa: 349.23,
  sol: 392.00,
  la: 440.00,
  si: 493.88,
};

interface DifficultySettings {
  minInterval: number; // Minimum semitones between notes
  timeBetweenNotes: number;
  noteDuration: number;
}

const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: { minInterval: 3, timeBetweenNotes: 1200, noteDuration: 0.8 },
  medium: { minInterval: 2, timeBetweenNotes: 900, noteDuration: 0.6 },
  hard: { minInterval: 1, timeBetweenNotes: 700, noteDuration: 0.5 },
};

export default function HigherLowerGame({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [firstNote, setFirstNote] = useState<NoteName>('do');
  const [secondNote, setSecondNote] = useState<NoteName>('mi');
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameState('listening');
    audioEngine.setInstrument(instrument);
    generateNewNotes();
  };

  const generateNewNotes = useCallback(() => {
    const settings = difficultySettings[difficulty];
    let first: NoteName;
    let second: NoteName;

    do {
      first = allNotes[Math.floor(Math.random() * allNotes.length)];
      second = allNotes[Math.floor(Math.random() * allNotes.length)];
      const interval = Math.abs(allNotes.indexOf(first) - allNotes.indexOf(second));
      if (interval >= settings.minInterval && first !== second) break;
    } while (true);

    setFirstNote(first);
    setSecondNote(second);
    playNotes(first, second);
  }, [difficulty]);

  const playNotes = async (note1: NoteName, note2: NoteName) => {
    setIsPlaying(true);
    const settings = difficultySettings[difficulty];

    audioEngine.playNote(note1, settings.noteDuration);
    await new Promise(resolve => setTimeout(resolve, settings.timeBetweenNotes));
    audioEngine.playNote(note2, settings.noteDuration);
    await new Promise(resolve => setTimeout(resolve, settings.noteDuration * 1000));

    setIsPlaying(false);
    setGameState('playing');
  };

  const handleAnswer = (answer: 'higher' | 'lower') => {
    if (gameState !== 'playing') return;

    const firstFreq = noteFrequencies[firstNote];
    const secondFreq = noteFrequencies[secondNote];
    const isHigher = secondFreq > firstFreq;
    const isCorrect = (answer === 'higher' && isHigher) || (answer === 'lower' && !isHigher);

    if (isCorrect) {
      setScore(score + 1);
      setGameState('correct');
      setTimeout(() => {
        setRound(round + 1);
        setGameState('listening');
        generateNewNotes();
      }, 2000);
    } else {
      setGameState('wrong');
      setTimeout(() => {
        setRound(round + 1);
        setGameState('listening');
        generateNewNotes();
      }, 2000);
    }
  };

  const handleReplay = () => {
    if (isPlaying) return;
    playNotes(firstNote, secondNote);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-4 py-2 rounded-xl transition-colors"
          >
            ← {t.menu}
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            ⬆️⬇️ {t.higherLower}
          </h1>
          <p className="text-purple-200">{t.higherLowerDesc}</p>
        </div>

        {/* Setup Screen */}
        {gameState === 'setup' && (
          <div className="space-y-8 bg-black/30 p-8 rounded-3xl border-2 border-green-500/30">
            <div>
              <h2 className="text-2xl font-bold text-green-300 mb-4">{t.difficulty}</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 scale-105'
                        : 'bg-green-500/20 hover:bg-green-500/30'
                    }`}
                  >
                    {diff === 'easy' && `😊 ${t.easy}`}
                    {diff === 'medium' && `🎵 ${t.medium}`}
                    {diff === 'hard' && `🔥 ${t.hard}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-300 mb-4">{t.instrument}</h2>
              <div className="grid grid-cols-5 gap-4">
                {(['piano', 'guitar', 'flute', 'violin', 'organ'] as InstrumentType[]).map((instr) => (
                  <button
                    key={instr}
                    onClick={() => setInstrument(instr)}
                    className={`p-4 rounded-xl font-bold transition-all capitalize ${
                      instrument === instr
                        ? 'bg-gradient-to-br from-emerald-500 to-green-500 scale-105'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30'
                    }`}
                  >
                    {instr === 'piano' && '🎹'}
                    {instr === 'guitar' && '🎸'}
                    {instr === 'flute' && '🎺'}
                    {instr === 'violin' && '🎻'}
                    {instr === 'organ' && '🎹'}
                    <div className="text-sm mt-1">{instr}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
            >
              🎮 {t.start}
            </button>
          </div>
        )}

        {/* Game Screen */}
        {gameState !== 'setup' && (
          <div className="space-y-6">
            {/* Score and Round */}
            <div className="bg-black/30 p-4 md:p-6 rounded-2xl border-2 border-green-500/30">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs md:text-sm text-green-300 mb-1">Round</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-200">{round}</div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-green-300 mb-1">Punteggio</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-200">{score}</div>
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="bg-black/30 p-6 rounded-2xl border-2 border-green-500/30 text-center">
              {(gameState === 'listening' || isPlaying) && (
                <div className="space-y-4">
                  <div className="text-6xl animate-pulse">🎵</div>
                  <div className="text-2xl font-bold text-green-300">{t.listenToTwoNotes}</div>
                  <div className="text-purple-200">Prima nota... poi seconda nota...</div>
                </div>
              )}

              {gameState === 'playing' && !isPlaying && (
                <div className="space-y-4">
                  <div className="text-3xl">🤔</div>
                  <div className="text-2xl font-bold text-green-300">
                    {t.wasSecondNoteHigherOrLower}
                  </div>
                  <button
                    onClick={handleReplay}
                    className="bg-green-500/30 hover:bg-green-500/50 px-6 py-3 rounded-xl text-green-200 font-bold"
                  >
                    🔁 {t.replay}
                  </button>
                </div>
              )}

              {gameState === 'correct' && (
                <div className="space-y-4">
                  <div className="text-6xl animate-bounce">🎉</div>
                  <div className="text-3xl font-bold text-green-300">{t.exactly}</div>
                  <div className="text-xl text-purple-200">
                    {firstNote} → {secondNote} ({noteFrequencies[secondNote] > noteFrequencies[firstNote] ? 'più alta' : 'più bassa'})
                  </div>
                </div>
              )}

              {gameState === 'wrong' && (
                <div className="space-y-4">
                  <div className="text-6xl">😔</div>
                  <div className="text-3xl font-bold text-red-300">{t.notQuite}</div>
                  <div className="text-xl text-purple-200">
                    {firstNote} → {secondNote} ({noteFrequencies[secondNote] > noteFrequencies[firstNote] ? 'più alta' : 'più bassa'})
                  </div>
                </div>
              )}
            </div>

            {/* Answer Buttons */}
            {gameState === 'playing' && !isPlaying && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer('higher')}
                  className="py-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-2xl shadow-lg hover:scale-105 transition-all"
                >
                  ⬆️ {t.higher}
                </button>
                <button
                  onClick={() => handleAnswer('lower')}
                  className="py-8 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-2xl shadow-lg hover:scale-105 transition-all"
                >
                  ⬇️ {t.lower}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

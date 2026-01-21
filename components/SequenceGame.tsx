'use client';

import { useState, useCallback } from 'react';
import { audioEngine, NoteName, InstrumentType } from '@/lib/audioEngine';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'idle' | 'setup' | 'watching' | 'playing' | 'correct' | 'wrong' | 'gameover';

const allNotes: NoteName[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];

const noteColors: Record<NoteName, string> = {
  do: 'from-red-400 to-red-600',
  re: 'from-orange-400 to-orange-600',
  mi: 'from-yellow-400 to-yellow-600',
  fa: 'from-green-400 to-green-600',
  sol: 'from-blue-400 to-blue-600',
  la: 'from-indigo-400 to-indigo-600',
  si: 'from-purple-400 to-purple-600',
};

interface DifficultySettings {
  startingLength: number;
  timeBetweenNotes: number;
  noteDuration: number;
  delayBeforeStart: number;
}

const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: { startingLength: 2, timeBetweenNotes: 800, noteDuration: 0.6, delayBeforeStart: 1500 },
  medium: { startingLength: 3, timeBetweenNotes: 600, noteDuration: 0.5, delayBeforeStart: 1000 },
  hard: { startingLength: 4, timeBetweenNotes: 500, noteDuration: 0.4, delayBeforeStart: 800 },
};

export default function SequenceGame({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<NoteName[]>([]);
  const [userSequence, setUserSequence] = useState<NoteName[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [highlightedNote, setHighlightedNote] = useState<NoteName | null>(null);
  const [bestScore, setBestScore] = useState(0);

  const startGame = () => {
    setLevel(1);
    setGameState('watching');
    audioEngine.setInstrument(instrument);
    const settings = difficultySettings[difficulty];
    generateNewSequence(settings.startingLength);
  };

  const generateNewSequence = useCallback(async (length: number) => {
    const settings = difficultySettings[difficulty];

    // Add one random note to the sequence
    const newSequence = [...sequence];
    if (newSequence.length === 0) {
      // First round - create sequence of specified length
      for (let i = 0; i < length; i++) {
        newSequence.push(allNotes[Math.floor(Math.random() * allNotes.length)]);
      }
    } else {
      // Add one note
      newSequence.push(allNotes[Math.floor(Math.random() * allNotes.length)]);
    }

    setSequence(newSequence);
    setUserSequence([]);

    // Wait before playing
    await new Promise(resolve => setTimeout(resolve, settings.delayBeforeStart));
    playSequence(newSequence);
  }, [difficulty, sequence]);

  const playSequence = async (seq: NoteName[]) => {
    setIsPlayingSequence(true);
    const settings = difficultySettings[difficulty];

    for (let i = 0; i < seq.length; i++) {
      setHighlightedNote(seq[i]);
      audioEngine.playNote(seq[i], settings.noteDuration);
      await new Promise(resolve => setTimeout(resolve, settings.timeBetweenNotes));
      setHighlightedNote(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsPlayingSequence(false);
    setGameState('playing');
  };

  const handleNoteClick = (note: NoteName) => {
    if (gameState !== 'playing' || isPlayingSequence) return;

    audioEngine.playNote(note, 0.4);
    const newUserSequence = [...userSequence, note];
    setUserSequence(newUserSequence);

    // Check if this note is correct
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong note!
      setGameState('wrong');
      if (level > bestScore) {
        setBestScore(level);
      }
      setTimeout(() => {
        setGameState('gameover');
      }, 2000);
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      setGameState('correct');
      setTimeout(() => {
        setLevel(level + 1);
        setGameState('watching');
        generateNewSequence(1); // Add one more note
      }, 1500);
    }
  };

  const handlePlayAgain = () => {
    setSequence([]);
    setUserSequence([]);
    startGame();
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            🎮 {t.sequenceGame}
          </h1>
          <p className="text-purple-200">{t.sequenceGameDesc}</p>
        </div>

        {/* Setup Screen */}
        {gameState === 'setup' && (
          <div className="space-y-8 bg-black/30 p-8 rounded-3xl border-2 border-orange-500/30">
            <div>
              <h2 className="text-2xl font-bold text-orange-300 mb-4">{t.difficulty}</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 scale-105'
                        : 'bg-orange-500/20 hover:bg-orange-500/30'
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
              <h2 className="text-2xl font-bold text-orange-300 mb-4">{t.instrument}</h2>
              <div className="grid grid-cols-5 gap-4">
                {(['piano', 'guitar', 'flute', 'violin', 'organ'] as InstrumentType[]).map((instr) => (
                  <button
                    key={instr}
                    onClick={() => setInstrument(instr)}
                    className={`p-4 rounded-xl font-bold transition-all capitalize ${
                      instrument === instr
                        ? 'bg-gradient-to-br from-red-500 to-orange-500 scale-105'
                        : 'bg-red-500/20 hover:bg-red-500/30'
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

            {bestScore > 0 && (
              <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-4 text-center">
                <div className="text-yellow-300 text-sm mb-1">🏆 {t.personalBest}</div>
                <div className="text-yellow-200 text-3xl font-bold">{t.level} {bestScore}</div>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
            >
              🎮 {t.start}
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="space-y-6 bg-black/30 p-8 rounded-3xl border-2 border-red-500/30 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-4xl font-bold text-red-300 mb-2">{t.gameOver}</h2>
            <div className="space-y-2">
              <div className="text-2xl text-purple-200">
                {t.youReachedLevel} <span className="font-bold text-orange-300">{level}</span>
              </div>
              {level > bestScore && (
                <div className="text-xl text-yellow-300 font-bold animate-pulse">
                  🎉 {t.newRecord}
                </div>
              )}
              {bestScore > 0 && level <= bestScore && (
                <div className="text-lg text-purple-300">
                  {t.personalBest} {t.level} {bestScore}
                </div>
              )}
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 mt-4">
              <div className="text-purple-200 mb-2">{t.sequenceWas}</div>
              <div className="flex justify-center gap-2 flex-wrap">
                {sequence.map((note, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-xl bg-gradient-to-br ${noteColors[note]} text-white font-bold text-sm`}
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handlePlayAgain}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl font-bold shadow-lg hover:shadow-2xl transition-all mt-6"
            >
              🔄 {t.playAgain}
            </button>
          </div>
        )}

        {/* Game Screen */}
        {gameState !== 'setup' && gameState !== 'gameover' && (
          <div className="space-y-6">
            {/* Level Display */}
            <div className="bg-black/30 p-4 md:p-6 rounded-2xl border-2 border-orange-500/30">
              <div className="text-center">
                <div className="text-xs md:text-sm text-orange-300 mb-1">{t.level}</div>
                <div className="text-3xl md:text-4xl font-bold text-orange-200">{level}</div>
                <div className="text-xs md:text-sm text-orange-300 mt-2">
                  {t.sequenceOf} {sequence.length} {sequence.length === 1 ? t.note : t.notes}
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="bg-black/30 p-6 rounded-2xl border-2 border-orange-500/30 text-center">
              {gameState === 'watching' && (
                <div className="space-y-4">
                  <div className="text-6xl animate-pulse">👀</div>
                  <div className="text-2xl font-bold text-orange-300">
                    {isPlayingSequence ? t.watchAndListen : t.prepareYourself}
                  </div>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="space-y-4">
                  <div className="text-3xl">🎹</div>
                  <div className="text-2xl font-bold text-orange-300">
                    {t.yourTurnSeq} ({userSequence.length}/{sequence.length})
                  </div>
                </div>
              )}

              {gameState === 'correct' && (
                <div className="space-y-4">
                  <div className="text-6xl animate-bounce">🎉</div>
                  <div className="text-3xl font-bold text-green-300">Perfetto!</div>
                  <div className="text-xl text-purple-200">{t.level} {level + 1}...</div>
                </div>
              )}

              {gameState === 'wrong' && (
                <div className="space-y-4">
                  <div className="text-6xl">❌</div>
                  <div className="text-3xl font-bold text-red-300">Ops!</div>
                </div>
              )}
            </div>

            {/* Note Grid */}
            {gameState === 'playing' && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {allNotes.map((note) => (
                  <button
                    key={note}
                    onClick={() => handleNoteClick(note)}
                    disabled={isPlayingSequence}
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${noteColors[note]} hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center text-2xl font-bold text-white disabled:opacity-50 ${
                      highlightedNote === note ? 'scale-110 ring-4 ring-white' : ''
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            )}

            {/* Watching mode - show highlighted notes */}
            {gameState === 'watching' && isPlayingSequence && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {allNotes.map((note) => (
                  <div
                    key={note}
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${noteColors[note]} transition-all shadow-lg flex items-center justify-center text-2xl font-bold text-white ${
                      highlightedNote === note ? 'scale-110 ring-4 ring-white animate-pulse' : 'opacity-50'
                    }`}
                  >
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

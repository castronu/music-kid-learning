'use client';

import { useState, useEffect, useCallback } from 'react';
import { audioEngine, NoteName, InstrumentType } from '@/lib/audioEngine';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'idle' | 'setup' | 'listening' | 'playing' | 'correct' | 'wrong';

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
  sequenceLength: number;
  timeBetweenNotes: number;
  noteDuration: number;
}

const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: { sequenceLength: 3, timeBetweenNotes: 800, noteDuration: 0.8 },
  medium: { sequenceLength: 4, timeBetweenNotes: 600, noteDuration: 0.6 },
  hard: { sequenceLength: 5, timeBetweenNotes: 500, noteDuration: 0.5 },
};

export default function MelodyDictationGame({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [targetSequence, setTargetSequence] = useState<NoteName[]>([]);
  const [userSequence, setUserSequence] = useState<NoteName[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameState('listening');
    audioEngine.setInstrument(instrument);
    generateNewSequence();
  };

  const generateNewSequence = useCallback(() => {
    const settings = difficultySettings[difficulty];
    const sequence: NoteName[] = [];
    for (let i = 0; i < settings.sequenceLength; i++) {
      sequence.push(allNotes[Math.floor(Math.random() * allNotes.length)]);
    }
    setTargetSequence(sequence);
    setUserSequence([]);
    playSequence(sequence);
  }, [difficulty]);

  const playSequence = async (sequence: NoteName[]) => {
    setIsPlayingSequence(true);
    const settings = difficultySettings[difficulty];

    for (let i = 0; i < sequence.length; i++) {
      audioEngine.playNote(sequence[i], settings.noteDuration);
      await new Promise(resolve => setTimeout(resolve, settings.timeBetweenNotes));
    }

    setIsPlayingSequence(false);
    setGameState('playing');
  };

  const handleNoteClick = (note: NoteName) => {
    if (gameState !== 'playing') return;

    audioEngine.playNote(note, 0.5);
    const newUserSequence = [...userSequence, note];
    setUserSequence(newUserSequence);

    // Check if sequence is complete
    if (newUserSequence.length === targetSequence.length) {
      checkSequence(newUserSequence);
    }
  };

  const checkSequence = (userSeq: NoteName[]) => {
    const isCorrect = userSeq.every((note, index) => note === targetSequence[index]);

    if (isCorrect) {
      setScore(score + 1);
      setGameState('correct');
      setTimeout(() => {
        setRound(round + 1);
        setGameState('listening');
        generateNewSequence();
      }, 2000);
    } else {
      setGameState('wrong');
      setTimeout(() => {
        setGameState('listening');
        generateNewSequence();
      }, 2000);
    }
  };

  const handleReplay = () => {
    if (isPlayingSequence) return;
    playSequence(targetSequence);
  };

  const handleClearSequence = () => {
    setUserSequence([]);
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
            ← Menu
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🎼 Dettato Melodico
          </h1>
          <p className="text-purple-200">Ascolta e riproduci la sequenza!</p>
        </div>

        {/* Setup Screen */}
        {gameState === 'setup' && (
          <div className="space-y-8 bg-black/30 p-8 rounded-3xl border-2 border-blue-500/30">
            <div>
              <h2 className="text-2xl font-bold text-blue-300 mb-4">Difficoltà</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 scale-105'
                        : 'bg-blue-500/20 hover:bg-blue-500/30'
                    }`}
                  >
                    {diff === 'easy' && '😊 Facile (3 note)'}
                    {diff === 'medium' && '🎵 Medio (4 note)'}
                    {diff === 'hard' && '🔥 Difficile (5 note)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-300 mb-4">Strumento</h2>
              <div className="grid grid-cols-5 gap-4">
                {(['piano', 'guitar', 'flute', 'violin', 'organ'] as InstrumentType[]).map((instr) => (
                  <button
                    key={instr}
                    onClick={() => setInstrument(instr)}
                    className={`p-4 rounded-xl font-bold transition-all capitalize ${
                      instrument === instr
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 scale-105'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30'
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
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
            >
              🎮 Inizia il Gioco!
            </button>
          </div>
        )}

        {/* Game Screen */}
        {gameState !== 'setup' && (
          <div className="space-y-6">
            {/* Score and Round */}
            <div className="bg-black/30 p-4 md:p-6 rounded-2xl border-2 border-blue-500/30">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs md:text-sm text-blue-300 mb-1">Round</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-200">{round}</div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-blue-300 mb-1">Punteggio</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-200">{score}</div>
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="bg-black/30 p-6 rounded-2xl border-2 border-blue-500/30 text-center">
              {gameState === 'listening' && isPlayingSequence && (
                <div className="space-y-4">
                  <div className="text-3xl animate-pulse">🎵</div>
                  <div className="text-2xl font-bold text-blue-300">Ascolta attentamente!</div>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="space-y-4">
                  <div className="text-3xl">🎹</div>
                  <div className="text-2xl font-bold text-blue-300">
                    Riproduci la sequenza! ({userSequence.length}/{targetSequence.length})
                  </div>
                  <button
                    onClick={handleReplay}
                    disabled={isPlayingSequence}
                    className="bg-blue-500/30 hover:bg-blue-500/50 px-6 py-3 rounded-xl text-blue-200 font-bold disabled:opacity-50"
                  >
                    🔁 Riascolta
                  </button>
                </div>
              )}

              {gameState === 'correct' && (
                <div className="space-y-4">
                  <div className="text-6xl animate-bounce">🎉</div>
                  <div className="text-3xl font-bold text-green-300">Perfetto!</div>
                </div>
              )}

              {gameState === 'wrong' && (
                <div className="space-y-4">
                  <div className="text-6xl">😔</div>
                  <div className="text-3xl font-bold text-red-300">Riprova!</div>
                  <div className="text-xl text-purple-200">
                    Era: {targetSequence.join(' - ')}
                  </div>
                </div>
              )}
            </div>

            {/* User's Sequence Display */}
            {gameState === 'playing' && userSequence.length > 0 && (
              <div className="bg-black/30 p-4 rounded-2xl border-2 border-cyan-500/30">
                <div className="text-center mb-3">
                  <div className="text-sm text-cyan-300">La tua sequenza:</div>
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {userSequence.map((note, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-xl bg-gradient-to-br ${noteColors[note]} text-white font-bold`}
                    >
                      {note}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <button
                    onClick={handleClearSequence}
                    className="bg-red-500/30 hover:bg-red-500/50 px-4 py-2 rounded-xl text-red-200 text-sm font-bold"
                  >
                    ❌ Cancella
                  </button>
                </div>
              </div>
            )}

            {/* Note Selection Grid */}
            {gameState === 'playing' && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {allNotes.map((note) => (
                  <button
                    key={note}
                    onClick={() => handleNoteClick(note)}
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${noteColors[note]} hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center text-2xl font-bold text-white`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

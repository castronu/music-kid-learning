'use client';

import { useState, useEffect, useCallback } from 'react';
import { audioEngine, NoteName, InstrumentType } from '@/lib/audioEngine';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'idle' | 'playing' | 'waiting' | 'feedback';

const allNotes: NoteName[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];

const difficultySettings = {
  easy: { timeLimit: 15000, noteDuration: 1.5 },
  medium: { timeLimit: 10000, noteDuration: 1.0 },
  hard: { timeLimit: 7000, noteDuration: 0.8 },
};

// Note colors for visual appeal
const noteColors: Record<NoteName, string> = {
  do: 'from-red-500 to-red-600',
  re: 'from-orange-500 to-orange-600',
  mi: 'from-yellow-500 to-yellow-600',
  fa: 'from-green-500 to-green-600',
  sol: 'from-blue-500 to-blue-600',
  la: 'from-indigo-500 to-indigo-600',
  si: 'from-purple-500 to-purple-600',
};

const instrumentIcons: Record<InstrumentType, string> = {
  piano: '🎹',
  guitar: '🎸',
  flute: '🎵',
  violin: '🎻',
  organ: '🎼',
};

const instrumentNames: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Chitarra',
  flute: 'Flauto',
  violin: 'Violino',
  organ: 'Organo',
};

export default function NoteRecognitionGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [currentNote, setCurrentNote] = useState<NoteName | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0); // Total hints used in the game
  const [currentRoundHints, setCurrentRoundHints] = useState(0); // Hints used in current round

  // Update audio engine when instrument changes
  useEffect(() => {
    audioEngine.setInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    return () => {
      audioEngine.close();
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const playRandomNote = useCallback(() => {
    const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
    setCurrentNote(randomNote);
    setGameState('playing');
    setFeedback(null);
    setCurrentRoundHints(0); // Reset hints for new round

    const { noteDuration } = difficultySettings[difficulty];
    audioEngine.playNote(randomNote, noteDuration);

    setTimeout(() => {
      setGameState('waiting');
      startTimer();
    }, (noteDuration * 1000) + 500);
  }, [difficulty]);

  const startTimer = () => {
    const { timeLimit } = difficultySettings[difficulty];
    setTimeLeft(timeLimit / 1000);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const handleTimeout = () => {
    setFeedback({
      type: 'incorrect',
      message: 'Tempo scaduto! Prova di nuovo.'
    });
    setTotalAttempts(prev => prev + 1);
    setGameState('feedback');
  };

  const handleNoteClick = (selectedNote: NoteName) => {
    if (gameState !== 'waiting') return;

    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    setTotalAttempts(prev => prev + 1);

    if (selectedNote === currentNote) {
      // Calculate points based on hints used
      // 3 points for no hints, 2 for 1-2 hints, 1 for 3+ hints
      let points = 3;
      if (currentRoundHints >= 3) {
        points = 1;
      } else if (currentRoundHints >= 1) {
        points = 2;
      }

      setScore(prev => prev + points);

      let message = `Perfetto! Era proprio "${currentNote.toUpperCase()}"! 🎵`;
      if (currentRoundHints === 0) {
        message += ' (+3 punti - Nessun indizio!)';
      } else if (currentRoundHints <= 2) {
        message += ` (+${points} punti - ${currentRoundHints} ${currentRoundHints === 1 ? 'indizio' : 'indizi'})`;
      } else {
        message += ` (+${points} punto - ${currentRoundHints} indizi)`;
      }

      setFeedback({
        type: 'correct',
        message
      });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Sbagliato! Era "${currentNote?.toUpperCase()}", hai scelto "${selectedNote.toUpperCase()}"`
      });
    }

    setGameState('feedback');
  };

  const handleNextNote = () => {
    playRandomNote();
  };

  const handleReplayNote = () => {
    if (currentNote) {
      const { noteDuration } = difficultySettings[difficulty];
      audioEngine.playNote(currentNote, noteDuration);

      // Count as hint only during waiting state
      if (gameState === 'waiting') {
        setCurrentRoundHints(prev => prev + 1);
        setHintsUsed(prev => prev + 1);
      }
    }
  };

  const handlePreviewNote = (note: NoteName) => {
    const { noteDuration } = difficultySettings[difficulty];
    audioEngine.playNote(note, noteDuration * 0.5);

    // Count as hint
    setCurrentRoundHints(prev => prev + 1);
    setHintsUsed(prev => prev + 1);
  };

  const handleStartGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setFeedback(null);
    setHintsUsed(0);
    setCurrentRoundHints(0);
    playRandomNote();
  };

  const handleResetGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setGameState('idle');
    setScore(0);
    setTotalAttempts(0);
    setFeedback(null);
    setCurrentNote(null);
    setTimeLeft(0);
    setHintsUsed(0);
    setCurrentRoundHints(0);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden">
      {/* Animated background music notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="music-note absolute top-20 left-10 text-6xl">♪</div>
        <div className="music-note absolute top-40 right-20 text-8xl" style={{ animationDelay: '1s' }}>♫</div>
        <div className="music-note absolute bottom-20 left-1/4 text-7xl" style={{ animationDelay: '2s' }}>♪</div>
        <div className="music-note absolute bottom-40 right-1/3 text-6xl" style={{ animationDelay: '0.5s' }}>♫</div>
      </div>

      {/* Main game container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎵 Music Helper
          </h1>
          <p className="text-lg md:text-xl text-purple-200">Riconoscimento Note Musicali</p>
        </div>

        {/* Main game card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-12 border-2 border-purple-500/30 shadow-2xl glow flex-1 flex flex-col justify-center">
          {gameState === 'idle' && (
            <div className="space-y-8">
              {/* Difficulty Selector */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-purple-200">Scegli la Difficoltà</h2>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                        difficulty === diff
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 glow-pink'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {diff === 'easy' ? '😊 Facile' : diff === 'medium' ? '🎵 Medio' : '🔥 Difficile'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrument Selector */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-purple-200">Scegli lo Strumento</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {(['piano', 'guitar', 'flute', 'violin', 'organ'] as InstrumentType[]).map((instr) => (
                    <button
                      key={instr}
                      onClick={() => setInstrument(instr)}
                      className={`px-4 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                        instrument === instr
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 glow text-white'
                          : 'bg-white/20 hover:bg-white/30 text-purple-100'
                      }`}
                    >
                      <div className="text-2xl mb-1">{instrumentIcons[instr]}</div>
                      <div className="text-xs">{instrumentNames[instr]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 glow-pink"
              >
                🎮 Inizia il Gioco!
              </button>

              <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/30 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-purple-200">📖 Come Giocare:</h3>
                  <ul className="space-y-2 text-purple-100">
                    <li>🎵 Ascolta la nota che viene suonata</li>
                    <li>🎹 Clicca sul bottone della nota corrispondente</li>
                    <li>✅ Ricevi feedback immediato</li>
                    <li>🏆 Migliora il tuo punteggio!</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 text-purple-200">💯 Sistema Punteggio:</h3>
                  <ul className="space-y-2 text-purple-100 text-sm">
                    <li>⭐ <strong>3 punti</strong> - Risposta corretta senza indizi</li>
                    <li>🌟 <strong>2 punti</strong> - Risposta corretta con 1-2 indizi</li>
                    <li>✨ <strong>1 punto</strong> - Risposta corretta con 3+ indizi</li>
                    <li>💡 Clicca sul bottone 🔊💡 per ascoltare anteprime (conta come indizio!)</li>
                    <li>🔁 Riascolta nota da indovinare (conta come indizio!)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="text-center space-y-4 md:space-y-8">
              <div className="text-5xl md:text-6xl animate-pulse">🎵</div>
              <h3 className="text-2xl md:text-3xl font-bold text-purple-200">Ascolta la nota...</h3>
              <div className="w-full bg-purple-500/20 h-3 md:h-4 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
              </div>
            </div>
          )}

          {gameState === 'waiting' && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-purple-200 mb-3">Quale nota era?</h3>

                {/* Timer and Hints */}
                <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
                  <div className={`text-2xl md:text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-purple-300'}`}>
                    ⏱️ {timeLeft}s
                  </div>
                  {currentRoundHints > 0 && (
                    <div className="text-lg md:text-xl font-bold text-orange-400">
                      💡 {currentRoundHints} {currentRoundHints === 1 ? 'indizio' : 'indizi'}
                    </div>
                  )}
                </div>
              </div>

              {/* Note buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {allNotes.map((note) => (
                  <div key={note} className="relative group/container">
                    <button
                      onClick={() => handleNoteClick(note)}
                      className={`
                        w-full bg-gradient-to-br ${noteColors[note]}
                        hover:scale-110 active:scale-95
                        text-white font-bold text-2xl md:text-3xl
                        py-5 md:py-8 px-4
                        rounded-2xl
                        transition-all duration-200
                        shadow-lg hover:shadow-2xl
                        border-2 border-white/20
                        relative overflow-hidden
                        group
                      `}
                    >
                      <div className="relative z-10">
                        {note.toUpperCase()}
                      </div>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-200" />
                    </button>

                    {/* Preview button - Always visible with hint indicator */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewNote(note);
                      }}
                      className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-2 border-white"
                      title={`Ascolta anteprima ${note.toUpperCase()} (indizio)`}
                    >
                      <div className="flex flex-col items-center justify-center text-xs leading-none">
                        <span className="text-sm">🔊</span>
                        <span className="text-[8px]">💡</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleReplayNote}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  🔊 Riascolta Nota
                </button>
              </div>
            </div>
          )}

          {gameState === 'feedback' && feedback && (
            <div className="space-y-8">
              <div className={`text-center p-8 rounded-2xl border-2 ${
                feedback.type === 'correct'
                  ? 'bg-green-500/20 border-green-500 glow-green'
                  : 'bg-red-500/20 border-red-500 glow-red'
              }`}>
                <div className="text-6xl mb-4">
                  {feedback.type === 'correct' ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  feedback.type === 'correct'
                    ? 'text-green-300'
                    : 'text-red-300'
                }`}>
                  {feedback.message}
                </h3>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleReplayNote}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  🔊 Riascolta Nota
                </button>
                <button
                  onClick={handleNextNote}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all glow-pink transform hover:scale-105"
                >
                  ▶️ Prossima Nota
                </button>
              </div>

              <button
                onClick={handleResetGame}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                🏠 Menu Principale
              </button>
            </div>
          )}
        </div>

        {/* Score board - Bottom, compact */}
        {gameState !== 'idle' && (
          <div className="mt-auto pt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-purple-500/30">
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                <div>
                  <div className="text-xl md:text-3xl font-bold text-green-400">{score}</div>
                  <div className="text-[10px] md:text-xs text-purple-200">Punti</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-blue-400">{totalAttempts}</div>
                  <div className="text-[10px] md:text-xs text-purple-200">Tentativi</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-orange-400">{hintsUsed}</div>
                  <div className="text-[10px] md:text-xs text-purple-200">Indizi</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-purple-400">
                    {totalAttempts > 0 ? Math.round((score / (totalAttempts * 3)) * 100) : 0}%
                  </div>
                  <div className="text-[10px] md:text-xs text-purple-200">Efficienza</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        {gameState !== 'idle' && (
          <div className="mt-2 text-center text-purple-300 text-xs md:text-sm">
            💡 Clicca 🔊💡 per anteprime (indizio!)
          </div>
        )}
      </div>
    </div>
  );
}

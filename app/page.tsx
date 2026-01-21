'use client';

import { useState } from 'react';
import GameSelector, { GameType } from '@/components/GameSelector';
import NoteRecognitionGame from '@/components/NoteRecognitionGame';
import MelodyDictationGame from '@/components/MelodyDictationGame';
import HigherLowerGame from '@/components/HigherLowerGame';
import SequenceGame from '@/components/SequenceGame';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  if (!selectedGame) {
    return <GameSelector onSelectGame={setSelectedGame} />;
  }

  return (
    <>
      {selectedGame === 'note-recognition' && <NoteRecognitionGame onBack={handleBackToMenu} />}
      {selectedGame === 'melody-dictation' && <MelodyDictationGame onBack={handleBackToMenu} />}
      {selectedGame === 'higher-lower' && <HigherLowerGame onBack={handleBackToMenu} />}
      {selectedGame === 'sequence' && <SequenceGame onBack={handleBackToMenu} />}
    </>
  );
}

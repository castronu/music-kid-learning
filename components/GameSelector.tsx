'use client';

export type GameType = 'note-recognition' | 'melody-dictation' | 'higher-lower' | 'sequence';

interface GameSelectorProps {
  onSelectGame: (game: GameType) => void;
}

export default function GameSelector({ onSelectGame }: GameSelectorProps) {
  const games = [
    {
      id: 'note-recognition' as GameType,
      title: '🎵 Riconoscimento Note',
      description: 'Ascolta e identifica la nota musicale',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'melody-dictation' as GameType,
      title: '🎼 Dettato Melodico',
      description: 'Riproduci la sequenza di note che ascolti',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'higher-lower' as GameType,
      title: '⬆️⬇️ Alto o Basso?',
      description: 'La seconda nota è più alta o più bassa?',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'sequence' as GameType,
      title: '🎮 Sequenze di Note',
      description: 'Ricorda e ripeti la sequenza (Simon Says)',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎵 Music Helper
        </h1>
        <p className="text-xl text-purple-200">
          Scegli un gioco per imparare la musica!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`bg-gradient-to-br ${game.color} p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 text-left group`}
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              {game.title}
            </h2>
            <p className="text-white/90 text-lg">
              {game.description}
            </p>
            <div className="mt-4 text-white/70 group-hover:text-white transition-colors">
              Clicca per iniziare →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';

export type GameType = 'note-recognition' | 'melody-dictation' | 'higher-lower' | 'sequence';

interface GameSelectorProps {
  onSelectGame: (game: GameType) => void;
}

const languageFlags: Record<Language, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
};

const languageNames: Record<Language, string> = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

export default function GameSelector({ onSelectGame }: GameSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const games = [
    {
      id: 'note-recognition' as GameType,
      title: `🎵 ${t.noteRecognition}`,
      description: t.noteRecognitionDesc,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'melody-dictation' as GameType,
      title: `🎼 ${t.melodyDictation}`,
      description: t.melodyDictationDesc,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'higher-lower' as GameType,
      title: `⬆️⬇️ ${t.higherLower}`,
      description: t.higherLowerDesc,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'sequence' as GameType,
      title: `🎮 ${t.sequenceGame}`,
      description: t.sequenceGameDesc,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 flex gap-2">
        {(['it', 'en', 'fr', 'es'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-2 rounded-xl font-bold transition-all ${
              language === lang
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={languageNames[lang]}
          >
            <span className="text-2xl">{languageFlags[lang]}</span>
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎵 {t.appTitle}
        </h1>
        <p className="text-xl text-purple-200">
          {t.appSubtitle}
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
              {t.start.replace('!', '')} →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

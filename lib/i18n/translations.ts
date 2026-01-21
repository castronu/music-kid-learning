export type Language = 'it' | 'en' | 'fr' | 'es';

export interface Translations {
  // Common
  menu: string;
  back: string;
  start: string;
  difficulty: string;
  instrument: string;
  easy: string;
  medium: string;
  hard: string;
  score: string;
  round: string;
  level: string;

  // Instruments
  piano: string;
  guitar: string;
  flute: string;
  violin: string;
  organ: string;

  // Main menu
  appTitle: string;
  appSubtitle: string;
  chooseGame: string;

  // Games
  noteRecognition: string;
  noteRecognitionDesc: string;
  melodyDictation: string;
  melodyDictationDesc: string;
  higherLower: string;
  higherLowerDesc: string;
  sequenceGame: string;
  sequenceGameDesc: string;

  // Note Recognition
  musicalNoteRecognition: string;
  listenAndIdentify: string;
  timeLeft: string;
  hints: string;
  attempts: string;
  accuracy: string;
  correct: string;
  wrong: string;
  listenCarefully: string;
  yourTurn: string;
  replay: string;

  // Melody Dictation
  listenCarefully2: string;
  reproduceSequence: string;
  yourSequence: string;
  clear: string;
  perfect: string;
  tryAgain: string;
  itWas: string;
  notes: string;
  note: string;

  // Higher/Lower
  listenToTwoNotes: string;
  wasSecondNoteHigherOrLower: string;
  higher: string;
  lower: string;
  exactly: string;
  notQuite: string;

  // Sequence Game
  watchAndListen: string;
  prepareYourself: string;
  yourTurnSeq: string;
  gameOver: string;
  youReachedLevel: string;
  newRecord: string;
  personalBest: string;
  sequenceWas: string;
  playAgain: string;
  sequenceOf: string;

  // Feedback messages
  feedbackCorrectNoHints: string;
  feedbackCorrectFewHints: string;
  feedbackCorrectManyHints: string;
  feedbackWrong: (correctNote: string, selectedNote: string) => string;

  // Difficulty descriptions
  easyDesc: string;
  mediumDesc: string;
  hardDesc: string;

  // Game-specific difficulty
  easyNotes: string;
  mediumNotes: string;
  hardNotes: string;
}

export const translations: Record<Language, Translations> = {
  it: {
    // Common
    menu: 'Menu',
    back: 'Indietro',
    start: 'Inizia il Gioco!',
    difficulty: 'Difficoltà',
    instrument: 'Strumento',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    score: 'Punteggio',
    round: 'Round',
    level: 'Livello',

    // Instruments
    piano: 'Piano',
    guitar: 'Chitarra',
    flute: 'Flauto',
    violin: 'Violino',
    organ: 'Organo',

    // Main menu
    appTitle: 'Music Helper',
    appSubtitle: 'Scegli un gioco per imparare la musica!',
    chooseGame: 'Scegli un gioco',

    // Games
    noteRecognition: 'Riconoscimento Note',
    noteRecognitionDesc: 'Ascolta e identifica la nota musicale',
    melodyDictation: 'Dettato Melodico',
    melodyDictationDesc: 'Riproduci la sequenza di note che ascolti',
    higherLower: 'Alto o Basso?',
    higherLowerDesc: 'La seconda nota è più alta o più bassa?',
    sequenceGame: 'Sequenze di Note',
    sequenceGameDesc: 'Ricorda e ripeti la sequenza (Simon Says)',

    // Note Recognition
    musicalNoteRecognition: 'Riconoscimento Note Musicali',
    listenAndIdentify: 'Ascolta e identifica la nota!',
    timeLeft: 'Tempo rimasto',
    hints: 'Aiuti',
    attempts: 'Tentativi',
    accuracy: 'Precisione',
    correct: 'Corretto!',
    wrong: 'Sbagliato!',
    listenCarefully: 'Ascolta attentamente la nota...',
    yourTurn: 'Il tuo turno! Scegli la nota:',
    replay: 'Riascolta',

    // Melody Dictation
    listenCarefully2: 'Ascolta attentamente!',
    reproduceSequence: 'Riproduci la sequenza!',
    yourSequence: 'La tua sequenza:',
    clear: 'Cancella',
    perfect: 'Perfetto!',
    tryAgain: 'Riprova!',
    itWas: 'Era:',
    notes: 'note',
    note: 'nota',

    // Higher/Lower
    listenToTwoNotes: 'Ascolta le due note!',
    wasSecondNoteHigherOrLower: 'La seconda nota era più alta o più bassa?',
    higher: 'Più Alta',
    lower: 'Più Bassa',
    exactly: 'Esatto!',
    notQuite: 'Non proprio!',

    // Sequence Game
    watchAndListen: 'Guarda e ascolta!',
    prepareYourself: 'Preparati...',
    yourTurnSeq: 'Il tuo turno!',
    gameOver: 'Game Over!',
    youReachedLevel: 'Hai raggiunto il livello',
    newRecord: 'Nuovo Record!',
    personalBest: 'Record personale:',
    sequenceWas: 'La sequenza era:',
    playAgain: 'Gioca Ancora',
    sequenceOf: 'Sequenza di',

    // Feedback messages
    feedbackCorrectNoHints: 'Perfetto! Nessun aiuto utilizzato! 🎉',
    feedbackCorrectFewHints: 'Ben fatto! Hai usato pochi aiuti 👍',
    feedbackCorrectManyHints: 'Corretto, ma hai usato molti aiuti 💡',
    feedbackWrong: (correct, selected) =>
      `Sbagliato! Era "${correct.toUpperCase()}", hai scelto "${selected.toUpperCase()}"`,

    // Difficulty descriptions
    easyDesc: 'Facile',
    mediumDesc: 'Medio',
    hardDesc: 'Difficile',

    // Game-specific difficulty
    easyNotes: '(3 note)',
    mediumNotes: '(4 note)',
    hardNotes: '(5 note)',
  },

  en: {
    // Common
    menu: 'Menu',
    back: 'Back',
    start: 'Start Game!',
    difficulty: 'Difficulty',
    instrument: 'Instrument',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    score: 'Score',
    round: 'Round',
    level: 'Level',

    // Instruments
    piano: 'Piano',
    guitar: 'Guitar',
    flute: 'Flute',
    violin: 'Violin',
    organ: 'Organ',

    // Main menu
    appTitle: 'Music Helper',
    appSubtitle: 'Choose a game to learn music!',
    chooseGame: 'Choose a game',

    // Games
    noteRecognition: 'Note Recognition',
    noteRecognitionDesc: 'Listen and identify the musical note',
    melodyDictation: 'Melody Dictation',
    melodyDictationDesc: 'Reproduce the note sequence you hear',
    higherLower: 'Higher or Lower?',
    higherLowerDesc: 'Is the second note higher or lower?',
    sequenceGame: 'Note Sequences',
    sequenceGameDesc: 'Remember and repeat the sequence (Simon Says)',

    // Note Recognition
    musicalNoteRecognition: 'Musical Note Recognition',
    listenAndIdentify: 'Listen and identify the note!',
    timeLeft: 'Time left',
    hints: 'Hints',
    attempts: 'Attempts',
    accuracy: 'Accuracy',
    correct: 'Correct!',
    wrong: 'Wrong!',
    listenCarefully: 'Listen carefully to the note...',
    yourTurn: 'Your turn! Choose the note:',
    replay: 'Replay',

    // Melody Dictation
    listenCarefully2: 'Listen carefully!',
    reproduceSequence: 'Reproduce the sequence!',
    yourSequence: 'Your sequence:',
    clear: 'Clear',
    perfect: 'Perfect!',
    tryAgain: 'Try again!',
    itWas: 'It was:',
    notes: 'notes',
    note: 'note',

    // Higher/Lower
    listenToTwoNotes: 'Listen to the two notes!',
    wasSecondNoteHigherOrLower: 'Was the second note higher or lower?',
    higher: 'Higher',
    lower: 'Lower',
    exactly: 'Exactly!',
    notQuite: 'Not quite!',

    // Sequence Game
    watchAndListen: 'Watch and listen!',
    prepareYourself: 'Get ready...',
    yourTurnSeq: 'Your turn!',
    gameOver: 'Game Over!',
    youReachedLevel: 'You reached level',
    newRecord: 'New Record!',
    personalBest: 'Personal best:',
    sequenceWas: 'The sequence was:',
    playAgain: 'Play Again',
    sequenceOf: 'Sequence of',

    // Feedback messages
    feedbackCorrectNoHints: 'Perfect! No hints used! 🎉',
    feedbackCorrectFewHints: 'Well done! You used few hints 👍',
    feedbackCorrectManyHints: 'Correct, but you used many hints 💡',
    feedbackWrong: (correct, selected) =>
      `Wrong! It was "${correct.toUpperCase()}", you chose "${selected.toUpperCase()}"`,

    // Difficulty descriptions
    easyDesc: 'Easy',
    mediumDesc: 'Medium',
    hardDesc: 'Hard',

    // Game-specific difficulty
    easyNotes: '(3 notes)',
    mediumNotes: '(4 notes)',
    hardNotes: '(5 notes)',
  },

  fr: {
    // Common
    menu: 'Menu',
    back: 'Retour',
    start: 'Commencer le Jeu!',
    difficulty: 'Difficulté',
    instrument: 'Instrument',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    score: 'Score',
    round: 'Manche',
    level: 'Niveau',

    // Instruments
    piano: 'Piano',
    guitar: 'Guitare',
    flute: 'Flûte',
    violin: 'Violon',
    organ: 'Orgue',

    // Main menu
    appTitle: 'Music Helper',
    appSubtitle: 'Choisis un jeu pour apprendre la musique!',
    chooseGame: 'Choisis un jeu',

    // Games
    noteRecognition: 'Reconnaissance de Notes',
    noteRecognitionDesc: 'Écoute et identifie la note musicale',
    melodyDictation: 'Dictée Mélodique',
    melodyDictationDesc: 'Reproduis la séquence de notes que tu entends',
    higherLower: 'Plus Haut ou Plus Bas?',
    higherLowerDesc: 'La deuxième note est-elle plus haute ou plus basse?',
    sequenceGame: 'Séquences de Notes',
    sequenceGameDesc: 'Mémorise et répète la séquence (Jacques a dit)',

    // Note Recognition
    musicalNoteRecognition: 'Reconnaissance de Notes Musicales',
    listenAndIdentify: 'Écoute et identifie la note!',
    timeLeft: 'Temps restant',
    hints: 'Indices',
    attempts: 'Tentatives',
    accuracy: 'Précision',
    correct: 'Correct!',
    wrong: 'Faux!',
    listenCarefully: 'Écoute attentivement la note...',
    yourTurn: 'À ton tour! Choisis la note:',
    replay: 'Réécouter',

    // Melody Dictation
    listenCarefully2: 'Écoute attentivement!',
    reproduceSequence: 'Reproduis la séquence!',
    yourSequence: 'Ta séquence:',
    clear: 'Effacer',
    perfect: 'Parfait!',
    tryAgain: 'Réessaye!',
    itWas: 'C\'était:',
    notes: 'notes',
    note: 'note',

    // Higher/Lower
    listenToTwoNotes: 'Écoute les deux notes!',
    wasSecondNoteHigherOrLower: 'La deuxième note était-elle plus haute ou plus basse?',
    higher: 'Plus Haut',
    lower: 'Plus Bas',
    exactly: 'Exactement!',
    notQuite: 'Pas tout à fait!',

    // Sequence Game
    watchAndListen: 'Regarde et écoute!',
    prepareYourself: 'Prépare-toi...',
    yourTurnSeq: 'À ton tour!',
    gameOver: 'Jeu Terminé!',
    youReachedLevel: 'Tu as atteint le niveau',
    newRecord: 'Nouveau Record!',
    personalBest: 'Meilleur score:',
    sequenceWas: 'La séquence était:',
    playAgain: 'Rejouer',
    sequenceOf: 'Séquence de',

    // Feedback messages
    feedbackCorrectNoHints: 'Parfait! Aucun indice utilisé! 🎉',
    feedbackCorrectFewHints: 'Bien joué! Tu as utilisé peu d\'indices 👍',
    feedbackCorrectManyHints: 'Correct, mais tu as utilisé beaucoup d\'indices 💡',
    feedbackWrong: (correct, selected) =>
      `Faux! C'était "${correct.toUpperCase()}", tu as choisi "${selected.toUpperCase()}"`,

    // Difficulty descriptions
    easyDesc: 'Facile',
    mediumDesc: 'Moyen',
    hardDesc: 'Difficile',

    // Game-specific difficulty
    easyNotes: '(3 notes)',
    mediumNotes: '(4 notes)',
    hardNotes: '(5 notes)',
  },

  es: {
    // Common
    menu: 'Menú',
    back: 'Atrás',
    start: '¡Empezar el Juego!',
    difficulty: 'Dificultad',
    instrument: 'Instrumento',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    score: 'Puntuación',
    round: 'Ronda',
    level: 'Nivel',

    // Instruments
    piano: 'Piano',
    guitar: 'Guitarra',
    flute: 'Flauta',
    violin: 'Violín',
    organ: 'Órgano',

    // Main menu
    appTitle: 'Music Helper',
    appSubtitle: '¡Elige un juego para aprender música!',
    chooseGame: 'Elige un juego',

    // Games
    noteRecognition: 'Reconocimiento de Notas',
    noteRecognitionDesc: 'Escucha e identifica la nota musical',
    melodyDictation: 'Dictado Melódico',
    melodyDictationDesc: 'Reproduce la secuencia de notas que escuchas',
    higherLower: '¿Más Alto o Más Bajo?',
    higherLowerDesc: '¿La segunda nota es más alta o más baja?',
    sequenceGame: 'Secuencias de Notas',
    sequenceGameDesc: 'Recuerda y repite la secuencia (Simón Dice)',

    // Note Recognition
    musicalNoteRecognition: 'Reconocimiento de Notas Musicales',
    listenAndIdentify: '¡Escucha e identifica la nota!',
    timeLeft: 'Tiempo restante',
    hints: 'Pistas',
    attempts: 'Intentos',
    accuracy: 'Precisión',
    correct: '¡Correcto!',
    wrong: '¡Incorrecto!',
    listenCarefully: 'Escucha atentamente la nota...',
    yourTurn: '¡Tu turno! Elige la nota:',
    replay: 'Repetir',

    // Melody Dictation
    listenCarefully2: '¡Escucha atentamente!',
    reproduceSequence: '¡Reproduce la secuencia!',
    yourSequence: 'Tu secuencia:',
    clear: 'Borrar',
    perfect: '¡Perfecto!',
    tryAgain: '¡Inténtalo de nuevo!',
    itWas: 'Era:',
    notes: 'notas',
    note: 'nota',

    // Higher/Lower
    listenToTwoNotes: '¡Escucha las dos notas!',
    wasSecondNoteHigherOrLower: '¿La segunda nota era más alta o más baja?',
    higher: 'Más Alto',
    lower: 'Más Bajo',
    exactly: '¡Exacto!',
    notQuite: '¡No del todo!',

    // Sequence Game
    watchAndListen: '¡Mira y escucha!',
    prepareYourself: 'Prepárate...',
    yourTurnSeq: '¡Tu turno!',
    gameOver: '¡Fin del Juego!',
    youReachedLevel: 'Alcanzaste el nivel',
    newRecord: '¡Nuevo Récord!',
    personalBest: 'Mejor puntuación:',
    sequenceWas: 'La secuencia era:',
    playAgain: 'Jugar de Nuevo',
    sequenceOf: 'Secuencia de',

    // Feedback messages
    feedbackCorrectNoHints: '¡Perfecto! ¡No usaste pistas! 🎉',
    feedbackCorrectFewHints: '¡Bien hecho! Usaste pocas pistas 👍',
    feedbackCorrectManyHints: 'Correcto, pero usaste muchas pistas 💡',
    feedbackWrong: (correct, selected) =>
      `¡Incorrecto! Era "${correct.toUpperCase()}", elegiste "${selected.toUpperCase()}"`,

    // Difficulty descriptions
    easyDesc: 'Fácil',
    mediumDesc: 'Medio',
    hardDesc: 'Difícil',

    // Game-specific difficulty
    easyNotes: '(3 notas)',
    mediumNotes: '(4 notas)',
    hardNotes: '(5 notas)',
  },
};

# 🎵 Music Helper - Giochi Musicali per Bambini

Un'applicazione web interattiva per aiutare i bambini (6-7 anni) a imparare la musica attraverso 4 giochi divertenti!

## ✨ Caratteristiche

- 🎮 **Quattro giochi musicali** - Diversi modi per imparare la musica
- 🎹 **Sintesi audio** - Note generate con Web Audio API
- 🎵 **Cinque strumenti** - Piano, chitarra, flauto, violino, organo
- 🎯 **Tre livelli di difficoltà** - Facile, Medio, Difficile
- 📊 **Sistema di punteggio** - Traccia le tue prestazioni
- 🎨 **Interfaccia musicale** - Design elegante con tema musicale
- 🌍 **Multilingue** - Italiano 🇮🇹, Inglese 🇬🇧, Francese 🇫🇷, Spagnolo 🇪🇸
- 🔄 **Auto-detect lingua** - Rileva automaticamente la lingua del browser
- 📱 **Responsive** - Ottimizzato per mobile e desktop

## 🚀 Come Iniziare

### Prerequisiti

- Node.js 18+ installato
- Un browser moderno con supporto Web Audio API

### Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel tuo browser.

### Build per Produzione

```bash
npm run build
npm start
```

## 🎮 I Quattro Giochi

### 🎵 Riconoscimento Note
Ascolta una nota e identifica quale sia cliccando sul tasto corretto.
- Sistema di aiuti (preview e replay)
- Timer con countdown
- Punteggio basato sull'uso degli aiuti

### 🎼 Dettato Melodico
Ascolta una sequenza di 3-5 note e riproducila nell'ordine corretto.
- Sequenze di lunghezza variabile (3-5 note)
- Possibilità di riascoltare la sequenza
- Punteggio crescente ad ogni round

### ⬆️⬇️ Alto o Basso?
Ascolta due note consecutive e determina se la seconda è più alta o più bassa.
- Confronto di altezze sonore
- Intervalli di difficoltà variabile
- Feedback immediato con le note esatte

### 🎮 Sequenze di Note (Simon Says)
Memorizza e ripeti sequenze di note sempre più lunghe.
- Sequenze progressive (ogni livello aggiunge una nota)
- Visualizzazione delle note durante la riproduzione
- Record personale salvato

## 🎯 Livelli di Difficoltà

Ogni gioco ha tre livelli:
- **😊 Facile** - Più tempo, sequenze più corte, intervalli più semplici
- **🎵 Medio** - Tempo e difficoltà standard
- **🔥 Difficile** - Meno tempo, sequenze più lunghe, intervalli complessi

## 🛠️ Tecnologie Utilizzate

- **Next.js 15** - React framework con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web Audio API** - Sintesi delle note musicali con ADSR envelope e armoniche

## 📝 Licenza

MIT

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

Buon divertimento con Music Helper! 🎵

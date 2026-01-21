# 🎵 Music Helper - Riconoscimento Note Musicali

Un'applicazione web interattiva per imparare a riconoscere le note musicali usando la tua voce!

## ✨ Caratteristiche

- 🎵 **Riconoscimento vocale** - Usa la tua voce per dire il nome della nota
- 🎹 **Sintesi audio** - Note generate con Web Audio API
- 🎮 **Tre livelli di difficoltà** - Facile, Medio, Difficile
- 📊 **Sistema di punteggio** - Traccia le tue prestazioni
- 🎨 **Interfaccia musicale** - Design elegante con tema musicale
- 🇮🇹 **Lingua italiana** - Sistema di notazione europea (do, re, mi, fa, sol, la, si)

## 🚀 Come Iniziare

### Prerequisiti

- Node.js 18+ installato
- Un browser moderno (Chrome o Edge consigliati per il riconoscimento vocale)
- Un microfono funzionante

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

## 🎮 Come Giocare

1. Scegli il livello di difficoltà
2. Clicca su "Inizia il Gioco!"
3. Ascolta la nota che viene suonata
4. Di' il nome della nota ad alta voce (do, re, mi, fa, sol, la, si)
5. Ricevi feedback immediato
6. Continua a giocare e migliora il tuo punteggio!

## 🎯 Livelli di Difficoltà

- **Facile** - 10 secondi per rispondere, note più lunghe
- **Medio** - 7 secondi per rispondere, durata standard
- **Difficile** - 5 secondi per rispondere, note più brevi

## 🛠️ Tecnologie Utilizzate

- **Next.js 15** - React framework con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web Audio API** - Sintesi delle note musicali
- **Web Speech API** - Riconoscimento vocale in italiano

## ⚠️ Note Importanti

- Il riconoscimento vocale funziona meglio su **Chrome** e **Edge**
- È necessario **abilitare il permesso del microfono** nel browser
- Per lo sviluppo locale, l'app funziona su HTTP (localhost)
- In produzione, è necessario HTTPS per il riconoscimento vocale

## 📝 Licenza

MIT

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

Buon divertimento con Music Helper! 🎵

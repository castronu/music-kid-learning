// Speech Recognition for Italian Note Names

import { NoteName } from './audioEngine';

export type SpeechRecognitionResult = {
  note: NoteName | null;
  confidence: number;
  transcript: string;
};

export class SpeechRecognitionEngine {
  private recognition: any = null;
  private isListening: boolean = false;

  initialize(): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'it-IT';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    return true;
  }

  listen(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      if (!this.initialize()) {
        onError?.('Speech recognition not supported');
        return;
      }
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const confidence = event.results[0][0].confidence;

      console.log('Recognized:', transcript, 'Confidence:', confidence);

      const note = this.parseNote(transcript);
      onResult({ note, confidence, transcript });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;

      let errorMessage = 'Errore nel riconoscimento vocale';
      if (event.error === 'no-speech') {
        errorMessage = 'Nessun audio rilevato. Prova di nuovo!';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Permesso microfono negato';
      }

      onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      onError?.('Errore nell\'avvio del riconoscimento vocale');
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  private parseNote(transcript: string): NoteName | null {
    // Normalize the transcript
    const normalized = transcript.toLowerCase().trim();

    // Direct matches
    const noteMap: Record<string, NoteName> = {
      'do': 'do',
      'doh': 'do',
      're': 're',
      'mi': 'mi',
      'fa': 'fa',
      'sol': 'sol',
      'la': 'la',
      'si': 'si',
    };

    // Check for direct match
    if (noteMap[normalized]) {
      return noteMap[normalized];
    }

    // Check if transcript contains any note name
    for (const [key, value] of Object.entries(noteMap)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    return null;
  }
}

export const speechRecognition = new SpeechRecognitionEngine();

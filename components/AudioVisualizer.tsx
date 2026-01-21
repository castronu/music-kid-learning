'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
  onVolumeChange?: (volume: number) => void;
}

export default function AudioVisualizer({ isListening, onVolumeChange }: AudioVisualizerProps) {
  const [volume, setVolume] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isListening) {
      startVisualizer();
    } else {
      stopVisualizer();
    }

    return () => {
      stopVisualizer();
    };
  }, [isListening]);

  const startVisualizer = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;

      microphone.connect(analyser);

      setIsActive(true);
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsActive(false);
    }
  };

  const stopVisualizer = () => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Disconnect microphone
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsActive(false);
    setVolume(0);
  };

  const updateVolume = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    const average = sum / dataArray.length;
    const normalizedVolume = Math.min(100, (average / 255) * 100 * 2); // Amplify for better visualization

    setVolume(normalizedVolume);
    onVolumeChange?.(normalizedVolume);

    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  // Create volume bars
  const volumeBars = Array.from({ length: 20 }, (_, i) => {
    const threshold = (i + 1) * 5; // Each bar represents 5% volume
    const isActive = volume >= threshold;
    const barColor =
      threshold <= 33 ? 'bg-green-500' :
      threshold <= 66 ? 'bg-yellow-500' :
      'bg-red-500';

    return (
      <div
        key={i}
        className={`flex-1 rounded-full transition-all duration-100 ${
          isActive ? `${barColor} opacity-100` : 'bg-gray-600 opacity-30'
        }`}
        style={{
          height: `${20 + (i * 3)}px`,
        }}
      />
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Microphone status indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
          isActive ? 'bg-red-500 animate-pulse glow-red' : 'bg-gray-500'
        }`} />
        <span className={`font-bold transition-colors ${
          isActive ? 'text-red-400' : 'text-gray-400'
        }`}>
          {isActive ? '🎤 MICROFONO ATTIVO' : '🎤 Microfono non attivo'}
        </span>
      </div>

      {/* Volume bars visualizer */}
      {isActive && (
        <div className="bg-black/30 rounded-2xl p-6 border-2 border-purple-500/30">
          <div className="flex items-end justify-center gap-1 h-32">
            {volumeBars}
          </div>

          {/* Volume percentage */}
          <div className="mt-4 text-center">
            <div className="text-sm text-purple-300 mb-2">Volume Audio</div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                style={{ width: `${volume}%` }}
              />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-200">
              {Math.round(volume)}%
            </div>
          </div>

          {/* Speaking indicator */}
          {volume > 15 && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-green-500/20 border-2 border-green-500 rounded-xl px-6 py-2 glow-green">
                <span className="text-green-300 font-bold animate-pulse">
                  🗣️ Ti sto ascoltando...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {!isActive && isListening && (
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-4 text-center">
          <p className="text-yellow-300 font-bold">
            ⚠️ Impossibile accedere al microfono
          </p>
          <p className="text-yellow-200 text-sm mt-2">
            Assicurati di aver dato il permesso per usare il microfono nel browser
          </p>
        </div>
      )}
    </div>
  );
}

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { countRamOccurrences } from '../constants/ramNames';

interface Props {
  enabled: boolean;
  onCount: (n: number) => void; // called with number of NEW japs detected
}

// v5 algorithm: max-seen tracking.
// Only count when the phrase's Ram-count grows past its previous maximum.
// Downward revisions by the engine are corrections, not new speech — ignored.
export function useVaaniJap({ enabled, onCount }: Props) {
  const [transcript, setTranscript] = useState('');
  const [available, setAvailable] = useState(true);
  const maxSeen = useRef(0);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const start = useCallback(async (askPerm: boolean) => {
    try {
      if (askPerm) {
        const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perm.granted) { setAvailable(false); return; }
      }
      maxSeen.current = 0;
      ExpoSpeechRecognitionModule.start({
        lang: 'hi-IN',
        interimResults: true,
        continuous: true,
        // Offline: prefer on-device engine. If the Hindi pack isn't installed,
        // Android falls back to online when connected; Settings screen guides the
        // user to download the offline pack for fully offline वाणी जप.
        requiresOnDeviceRecognition: false,
        androidIntentOptions: { EXTRA_PREFER_OFFLINE: true },
        addsPunctuation: false,
        contextualStrings: ['राम', 'जय राम', 'श्री राम', 'जय श्री राम', 'सियाराम',
          'ram', 'raam', 'jai ram', 'shri ram', 'jai shri ram', 'siyaram'],
      });
    } catch (e) { setAvailable(false); }
  }, []);

  const stop = useCallback(() => {
    maxSeen.current = 0;
    try { ExpoSpeechRecognitionModule.stop(); } catch (e) {}
  }, []);

  useSpeechRecognitionEvent('result', (event) => {
    if (!enabledRef.current) return;
    const t = event.results?.[0]?.transcript || '';
    const isFinal = (event as any).isFinal ?? false;
    if (!t) return;
    setTranscript(t);

    const total = countRamOccurrences(t);
    if (total > maxSeen.current) {
      const newOnes = total - maxSeen.current;
      maxSeen.current = total;
      onCount(newOnes);
    }
    // total < maxSeen → engine revised down; ignore (prevents over-counting)
    if (isFinal) maxSeen.current = 0; // phrase ended, next phrase starts fresh
  });

  useSpeechRecognitionEvent('end', () => {
    maxSeen.current = 0;
    if (enabledRef.current) setTimeout(() => start(false), 300);
  });

  useSpeechRecognitionEvent('error', () => {
    maxSeen.current = 0;
    if (enabledRef.current) setTimeout(() => start(false), 1000);
  });

  useEffect(() => {
    if (enabled) start(true); else stop();
    return () => stop();
  }, [enabled]);

  return { transcript, available };
}

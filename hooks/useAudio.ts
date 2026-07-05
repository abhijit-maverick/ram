import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useAudio() {
  const chime = useRef<Audio.Sound | null>(null);
  const bell = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: true });
        const c = await Audio.Sound.createAsync(require('../assets/audio/wind_chime.mp3'), { volume: 0.85 });
        chime.current = c.sound;
        const b = await Audio.Sound.createAsync(require('../assets/audio/temple_bell.mp3'), { volume: 0.92 });
        bell.current = b.sound;
      } catch (e) {}
    })();
    return () => { chime.current?.unloadAsync(); bell.current?.unloadAsync(); };
  }, []);

  const playMilestone = useCallback(async (m: number) => {
    try {
      const s = m === 54 ? chime.current : m === 108 ? bell.current : null;
      if (s) { await s.setPositionAsync(0); await s.playAsync(); }
    } catch (e) {}
  }, []);

  return { playMilestone };
}

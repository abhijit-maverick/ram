import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type JapaMode = 'man' | 'vaani';
export type Lang = 'hi' | 'en';

export interface DayRecord { date: string; count: number; goalMet: boolean; }

interface JapaState {
  todayCount: number;
  totalCount: number;
  dailyGoal: number;
  streak: number;
  longestStreak: number;
  history: DayRecord[];
  mode: JapaMode;
  lang: Lang;
  soundOn: boolean;
  hapticOn: boolean;
}

const KEY = 'japa_state_v2';
const defaults: JapaState = {
  todayCount: 0, totalCount: 0, dailyGoal: 108,
  streak: 0, longestStreak: 0, history: [],
  mode: 'man', lang: 'hi', soundOn: true, hapticOn: true,
};

export function useJapaStore() {
  const [state, setState] = useState<JapaState>(defaults);
  const [loaded, setLoaded] = useState(false);

  const today = () => format(new Date(), 'yyyy-MM-dd');

  useEffect(() => { (async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as JapaState & { lastDate?: string };
        const t = today();
        if ((s.lastDate || t) !== t) {
          const met = s.todayCount >= s.dailyGoal;
          const hist: DayRecord[] = s.todayCount > 0
            ? [{ date: s.lastDate!, count: s.todayCount, goalMet: met }, ...s.history].slice(0, 90)
            : s.history;
          const newStreak = met ? s.streak + 1 : 0;
          setState({ ...defaults, ...s, todayCount: 0, streak: newStreak,
            longestStreak: Math.max(s.longestStreak || 0, newStreak), history: hist });
        } else {
          setState({ ...defaults, ...s });
        }
      }
    } catch (e) {} finally { setLoaded(true); }
  })(); }, []);

  const save = async (s: JapaState) => {
    try { await AsyncStorage.setItem(KEY, JSON.stringify({ ...s, lastDate: today() })); } catch (e) {}
  };

  const update = useCallback((patch: Partial<JapaState>) => {
    setState(prev => { const next = { ...prev, ...patch }; save(next); return next; });
  }, []);

  const increment = useCallback((by = 1) => {
    setState(prev => {
      const next = { ...prev, todayCount: prev.todayCount + by, totalCount: prev.totalCount + by };
      save(next);
      return next;
    });
  }, []);

  const resetToday = useCallback(() => update({ todayCount: 0 }), [update]);
  const wipeAll = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setState(defaults);
  }, []);

  return { ...state, loaded, increment, update, resetToday, wipeAll };
}

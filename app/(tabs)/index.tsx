import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useJapaStore } from '../../hooks/useJapaStore';
import { useVaaniJap } from '../../hooks/useVaaniJap';
import { useAudio } from '../../hooks/useAudio';
import { getRandomRamText } from '../../constants/ramNames';
import { T } from '../../constants/strings';
import { COLORS, MALA, scale, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../constants/theme';
import TempleBackground from '../../components/TempleBackground';
import RudrakshMala from '../../components/RudrakshMala';
import CharanButton from '../../components/CharanButton';
import { FloatingRam, FloatingPetal } from '../../components/FloatingChant';

interface Particle { id: number; x: number; y: number; text?: string; kind: 'ram' | 'petal'; }
let pid = 0;
const TAP_COOLDOWN = 550;

export default function Home() {
  const store = useJapaStore();
  const { playMilestone } = useAudio();
  const t = T[store.lang];

  const [particles, setParticles] = useState<Particle[]>([]);
  const [spinTick, setSpinTick] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [flash, setFlash] = useState(false);
  const lastTap = useRef(0);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const removeParticle = useCallback((id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  const spawnEffects = useCallback(() => {
    const ps: Particle[] = [];
    ps.push({
      id: ++pid, kind: 'ram',
      x: SCREEN_WIDTH * 0.22 + Math.random() * SCREEN_WIDTH * 0.5,
      y: SCREEN_HEIGHT * 0.28 + Math.random() * SCREEN_HEIGHT * 0.18,
      text: getRandomRamText(),
    });
    for (let i = 0; i < 4; i++) {
      ps.push({
        id: ++pid, kind: 'petal',
        x: SCREEN_WIDTH * 0.04 + Math.random() * SCREEN_WIDTH * 0.9,
        y: SCREEN_HEIGHT * 0.2 + Math.random() * SCREEN_HEIGHT * 0.45,
      });
    }
    setParticles(prev => [...prev, ...ps]);
  }, []);

  const registerJap = useCallback((by: number) => {
    const before = store.todayCount;
    store.increment(by);
    if (store.hapticOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSpinTick(k => k + 1);
    spawnEffects();

    // milestones — check every mala position crossed by this increment
    for (let c = before + 1; c <= before + by; c++) {
      const pos = c % 108;
      if (pos === 54) {
        if (store.soundOn) playMilestone(54);
        setFlash(true);
        flashAnim.setValue(0.7);
        Animated.timing(flashAnim, { toValue: 0, duration: 800, useNativeDriver: true })
          .start(() => setFlash(false));
      } else if (pos === 0) {
        if (store.soundOn) playMilestone(108);
        if (store.hapticOn) {
          setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 300);
          setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 600);
          setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 900);
        }
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2600);
      }
    }
  }, [store.todayCount, store.hapticOn, store.soundOn, spawnEffects, playMilestone]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < TAP_COOLDOWN) return;
    lastTap.current = now;
    registerJap(1);
  }, [registerJap]);

  // वाणी जप — v5 max-tracking, counts new occurrences
  const { transcript } = useVaaniJap({
    enabled: store.mode === 'vaani',
    onCount: (n) => registerJap(n),
  });

  if (!store.loaded) {
    return (
      <View style={st.loading}>
        <Text style={st.loadingText}>॥ जय श्री राम ॥</Text>
      </View>
    );
  }

  const pct = Math.min(100, Math.round((store.todayCount / store.dailyGoal) * 100));

  return (
    <TempleBackground>
      <SafeAreaView style={st.safe}>
        {/* top bar */}
        <View style={st.topBar}>
          <Text style={st.crown}>👑</Text>
          <Text style={st.tagline}>{t.tagline}</Text>
          <TouchableOpacity onPress={() => store.update({ lang: store.lang === 'hi' ? 'en' : 'hi' })}>
            <Text style={st.langBtn}>{store.lang === 'hi' ? 'EN' : 'हिं'}</Text>
          </TouchableOpacity>
        </View>

        {/* stats card */}
        <View style={st.stats}>
          <View style={st.statItem}>
            <Text style={st.statVal}>🔥 {store.streak}</Text>
            <Text style={st.statLabel}>{t.streak}</Text>
          </View>
          <View style={st.statDiv} />
          <View style={st.statItem}>
            <Text style={st.statVal}>{store.todayCount}</Text>
            <Text style={st.statLabel}>{t.today}</Text>
          </View>
          <View style={st.statDiv} />
          <View style={st.statItem}>
            <Text style={st.statVal}>{store.dailyGoal}</Text>
            <Text style={st.statLabel}>{t.goal}</Text>
          </View>
          <View style={st.statDiv} />
          <View style={st.statItem}>
            <Text style={st.statVal}>{store.totalCount.toLocaleString('en-IN')}</Text>
            <Text style={st.statLabel}>{t.total}</Text>
          </View>
        </View>

        {/* banner */}
        <View style={st.banner}>
          <Text style={st.bannerText}>{t.banner}</Text>
        </View>

        {/* big count */}
        <Text style={st.bigCount}>{store.todayCount}</Text>

        {/* mala + charan */}
        <View style={st.malaWrap}>
          <RudrakshMala count={store.todayCount} spinTick={spinTick} />
          {/* tassel */}
          <View style={st.tasselKnot} />
          <View style={st.tassel} />
          <View style={st.charanOverlay}>
            <CharanButton onPress={handleTap} label={t.charan} />
          </View>
        </View>

        {/* mode toggle */}
        <View style={st.toggle}>
          <TouchableOpacity
            style={[st.toggleBtn, store.mode === 'man' && st.toggleBtnActive]}
            onPress={() => store.update({ mode: 'man' })}>
            <Text style={[st.toggleText, store.mode === 'man' && st.toggleTextActive]}>{t.manJap}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.toggleBtn, store.mode === 'vaani' && st.toggleBtnActive]}
            onPress={() => store.update({ mode: 'vaani' })}>
            <Text style={[st.toggleText, store.mode === 'vaani' && st.toggleTextActive]}>{t.vaaniJap}</Text>
          </TouchableOpacity>
        </View>

        {/* vaani indicator */}
        {store.mode === 'vaani' && (
          <View style={st.listenWrap}>
            <View style={st.listenRow}>
              <View style={st.listenDot} />
              <Text style={st.listenText}>{t.listening}</Text>
            </View>
            {transcript ? <Text style={st.transcript} numberOfLines={1}>{transcript}</Text> : null}
          </View>
        )}

        {/* progress */}
        <View style={st.progressWrap}>
          <View style={st.progressLabels}>
            <Text style={st.progressLabel}>{t.todayGoal}</Text>
            <Text style={st.progressLabel}>{pct}%</Text>
          </View>
          <View style={st.progressTrack}>
            <View style={[st.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>

        {/* decoration */}
        <View style={st.decoRow}>
          <Text style={st.deco}>🪷</Text>
          <Text style={[st.deco, { fontSize: scale(22) }]}>🪔</Text>
          <Text style={st.deco}>🪷</Text>
        </View>
      </SafeAreaView>

      {/* 54 gold flash */}
      {flash && (
        <Animated.View pointerEvents="none" style={[st.flash, { opacity: flashAnim }]} />
      )}

      {/* 108 celebration */}
      {celebrate && (
        <View pointerEvents="none" style={st.celebrateWrap}>
          <View style={st.celebrateBox}>
            <Text style={st.celebrateText}>{t.malaComplete}</Text>
          </View>
        </View>
      )}

      {/* particles */}
      {particles.map(p =>
        p.kind === 'ram'
          ? <FloatingRam key={p.id} x={p.x} y={p.y} text={p.text!} onDone={() => removeParticle(p.id)} />
          : <FloatingPetal key={p.id} x={p.x} y={p.y} onDone={() => removeParticle(p.id)} />
      )}
    </TempleBackground>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: scale(14), alignItems: 'center' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  loadingText: { fontSize: scale(18), color: COLORS.maroon, letterSpacing: 3 },
  topBar: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: scale(8), marginBottom: scale(8),
  },
  crown: { fontSize: scale(19) },
  tagline: {
    flex: 1, textAlign: 'center', fontSize: scale(13), color: COLORS.gold,
    letterSpacing: 2, fontWeight: '700',
    textShadowColor: 'rgba(255,255,255,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1,
  },
  langBtn: {
    fontSize: scale(12), color: COLORS.maroon, fontWeight: '700',
    borderWidth: 1, borderColor: COLORS.border, borderRadius: scale(8),
    paddingHorizontal: scale(8), paddingVertical: scale(3),
    backgroundColor: COLORS.card, overflow: 'hidden',
  },
  stats: {
    width: '100%', flexDirection: 'row', backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: scale(14),
    paddingVertical: scale(10), marginBottom: scale(8),
    elevation: 3, shadowColor: COLORS.maroon, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: scale(15), fontWeight: '700', color: COLORS.maroon },
  statLabel: { fontSize: scale(10), color: COLORS.textMuted, marginTop: 1 },
  statDiv: { width: 1, backgroundColor: 'rgba(200,144,58,0.35)' },
  banner: {
    width: '100%', backgroundColor: COLORS.card, borderWidth: 1,
    borderColor: COLORS.border, borderRadius: scale(12),
    paddingVertical: scale(6), alignItems: 'center', marginBottom: scale(4),
  },
  bannerText: { fontSize: scale(16), color: COLORS.maroonDark, letterSpacing: 4, fontWeight: '700' },
  bigCount: {
    fontSize: scale(52), fontWeight: '700', color: COLORS.maroon, lineHeight: scale(58),
    textShadowColor: 'rgba(255,255,255,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  malaWrap: {
    width: MALA.ringSize, height: MALA.ringSize + scale(14),
    alignItems: 'center', justifyContent: 'flex-start',
  },
  charanOverlay: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: scale(14),
    alignItems: 'center', justifyContent: 'center',
  },
  tasselKnot: {
    position: 'absolute', bottom: scale(8), alignSelf: 'center',
    width: scale(11), height: scale(11), borderRadius: scale(6),
    backgroundColor: '#e2a936', borderWidth: 1, borderColor: '#9a6a14',
  },
  tassel: {
    position: 'absolute', bottom: scale(-8), alignSelf: 'center',
    width: scale(14), height: scale(18), backgroundColor: '#c8963a',
    borderBottomLeftRadius: scale(5), borderBottomRightRadius: scale(5),
  },
  toggle: {
    flexDirection: 'row', width: scale(220), backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 999,
    padding: scale(4), marginTop: scale(6),
  },
  toggleBtn: { flex: 1, paddingVertical: scale(7), alignItems: 'center', borderRadius: 999 },
  toggleBtnActive: {
    backgroundColor: COLORS.gold,
    elevation: 2, shadowColor: COLORS.maroon, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },
  toggleText: { fontSize: scale(13), color: COLORS.textMuted, fontWeight: '600' },
  toggleTextActive: { color: '#fff', fontWeight: '700' },
  listenWrap: { alignItems: 'center', marginTop: scale(4), minHeight: scale(30) },
  listenRow: { flexDirection: 'row', alignItems: 'center', gap: scale(7) },
  listenDot: {
    width: scale(9), height: scale(9), borderRadius: scale(5),
    backgroundColor: COLORS.green,
  },
  listenText: { fontSize: scale(12), color: COLORS.maroonDark },
  transcript: { fontSize: scale(10), color: COLORS.textMuted, fontStyle: 'italic', maxWidth: scale(320) },
  progressWrap: { width: '100%', maxWidth: scale(330), marginTop: scale(6) },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(3) },
  progressLabel: { fontSize: scale(11), color: COLORS.maroon },
  progressTrack: {
    height: scale(7), borderRadius: scale(4), backgroundColor: 'rgba(180,120,40,0.18)',
    borderWidth: 1, borderColor: 'rgba(180,120,40,0.2)', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: scale(4), backgroundColor: COLORS.goldBright },
  decoRow: { flexDirection: 'row', alignItems: 'flex-end', gap: scale(24), marginTop: scale(6), paddingBottom: scale(6) },
  deco: { fontSize: scale(17) },
  flash: {
    ...StyleSheet.absoluteFillObject, zIndex: 70,
    backgroundColor: 'rgba(255,214,110,0.75)',
  },
  celebrateWrap: {
    ...StyleSheet.absoluteFillObject, zIndex: 72,
    alignItems: 'center', justifyContent: 'center',
  },
  celebrateBox: {
    backgroundColor: 'rgba(90,30,0,0.93)', borderRadius: scale(18),
    paddingHorizontal: scale(28), paddingVertical: scale(20),
    borderWidth: 1.5, borderColor: 'rgba(240,168,48,0.7)',
  },
  celebrateText: { color: '#FFDF9A', fontSize: scale(19), textAlign: 'center', lineHeight: scale(30) },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { T } from '../../constants/strings';
import { COLORS, scale } from '../../constants/theme';
import TempleBackground from '../../components/TempleBackground';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  addMonths, subMonths, isSameDay, isAfter,
} from 'date-fns';

const HI_DAYS = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

export default function Streak() {
  const store = useJapaStore();
  const t = T[store.lang];
  const [month, setMonth] = useState(new Date());

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const histMap = new Map(store.history.map(h => [h.date, h]));
  histMap.set(todayStr, { date: todayStr, count: store.todayCount, goalMet: store.todayCount >= store.dailyGoal });

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leadingBlanks = getDay(startOfMonth(month));

  return (
    <TempleBackground>
      <SafeAreaView style={st.safe}>
        <ScrollView contentContainerStyle={st.content}>
          <Text style={st.title}>{t.streakTitle}</Text>

          <View style={st.badge}>
            <Text style={st.badgeNum}>🔥 {store.streak}</Text>
            <Text style={st.badgeLabel}>{t.dayStreak}</Text>
          </View>

          <View style={st.pairRow}>
            <View style={st.pairCard}>
              <Text style={st.pairVal}>{store.streak}</Text>
              <Text style={st.pairLabel}>{t.current}</Text>
            </View>
            <View style={st.pairCard}>
              <Text style={st.pairVal}>{store.longestStreak}</Text>
              <Text style={st.pairLabel}>{t.longest}</Text>
            </View>
          </View>

          <View style={st.calCard}>
            <View style={st.calHeader}>
              <TouchableOpacity style={st.navBtn} onPress={() => setMonth(m => subMonths(m, 1))}>
                <Text style={st.navText}>‹</Text>
              </TouchableOpacity>
              <Text style={st.monthLabel}>{format(month, 'MMMM yyyy')}</Text>
              <TouchableOpacity style={st.navBtn} onPress={() => setMonth(m => addMonths(m, 1))}>
                <Text style={st.navText}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={st.weekRow}>
              {HI_DAYS.map((d, i) => <Text key={i} style={st.weekDay}>{d}</Text>)}
            </View>
            <View style={st.grid}>
              {Array.from({ length: leadingBlanks }).map((_, i) => <View key={`b${i}`} style={st.cellEmpty} />)}
              {days.map(day => {
                const ds = format(day, 'yyyy-MM-dd');
                const rec = histMap.get(ds);
                const isToday = isSameDay(day, today);
                const future = isAfter(day, today);
                const met = rec?.goalMet && !future;
                const partial = !met && (rec?.count ?? 0) > 0 && !future;
                return (
                  <View key={ds} style={[
                    st.cell,
                    met && st.cellMet, partial && st.cellPartial,
                    isToday && st.cellToday, future && st.cellFuture,
                  ]}>
                    <Text style={[st.cellText, (met || partial) && st.cellTextActive]}>{format(day, 'd')}</Text>
                    {met && <Text style={st.cellMark}>✓</Text>}
                  </View>
                );
              })}
            </View>
            <View style={st.legend}>
              <View style={st.legendItem}><View style={[st.legendBox, st.cellMet]} /><Text style={st.legendText}>{t.goalMet}</Text></View>
              <View style={st.legendItem}><View style={[st.legendBox, st.cellPartial]} /><Text style={st.legendText}>{t.partial}</Text></View>
              <View style={st.legendItem}><View style={st.legendBox} /><Text style={st.legendText}>{t.none}</Text></View>
            </View>
          </View>

          <Text style={st.quote}>{t.quote}</Text>
        </ScrollView>
      </SafeAreaView>
    </TempleBackground>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: scale(16), alignItems: 'center', paddingBottom: scale(30) },
  title: { fontSize: scale(24), fontWeight: '700', color: COLORS.maroonDark, alignSelf: 'flex-start', marginBottom: scale(12) },
  badge: {
    width: scale(150), height: scale(150), borderRadius: scale(75),
    backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 3, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center', marginBottom: scale(14),
    elevation: 6, shadowColor: COLORS.goldBright, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 20,
  },
  badgeNum: { fontSize: scale(34), fontWeight: '700', color: COLORS.maroon },
  badgeLabel: { fontSize: scale(12), color: COLORS.textMuted, marginTop: 2 },
  pairRow: { flexDirection: 'row', gap: scale(12), width: '100%', marginBottom: scale(12) },
  pairCard: {
    flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: scale(12), padding: scale(10), alignItems: 'center',
  },
  pairVal: { fontSize: scale(17), fontWeight: '700', color: COLORS.maroon },
  pairLabel: { fontSize: scale(10), color: COLORS.textMuted },
  calCard: {
    width: '100%', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: scale(14), padding: scale(12),
  },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(10) },
  navBtn: {
    width: scale(30), height: scale(30), borderRadius: scale(8),
    borderWidth: 1, borderColor: 'rgba(180,120,40,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  navText: { fontSize: scale(15), color: COLORS.maroon },
  monthLabel: { fontSize: scale(14), fontWeight: '700', color: COLORS.maroonDark },
  weekRow: { flexDirection: 'row', marginBottom: scale(5) },
  weekDay: { flex: 1, textAlign: 'center', fontSize: scale(9), color: COLORS.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: scale(8), borderWidth: 1, borderColor: 'rgba(180,120,40,0.15)',
    backgroundColor: 'rgba(180,120,40,0.06)', marginBottom: scale(3),
  },
  cellEmpty: { width: `${100 / 7}%`, aspectRatio: 1 },
  cellMet: { backgroundColor: 'rgba(240,168,48,0.45)', borderColor: COLORS.goldBright },
  cellPartial: { backgroundColor: 'rgba(240,168,48,0.18)', borderColor: COLORS.gold },
  cellToday: { borderWidth: 2, borderColor: COLORS.maroon },
  cellFuture: { opacity: 0.35 },
  cellText: { fontSize: scale(11), color: COLORS.textMuted },
  cellTextActive: { color: COLORS.maroonDark, fontWeight: '700' },
  cellMark: { position: 'absolute', top: 2, right: 4, fontSize: scale(8), color: COLORS.maroon },
  legend: { flexDirection: 'row', gap: scale(14), justifyContent: 'center', marginTop: scale(10), flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: scale(5) },
  legendBox: {
    width: scale(12), height: scale(12), borderRadius: scale(4),
    backgroundColor: 'rgba(180,120,40,0.1)', borderWidth: 1, borderColor: 'rgba(180,120,40,0.25)',
  },
  legendText: { fontSize: scale(10), color: COLORS.maroon },
  quote: {
    fontSize: scale(17), color: COLORS.maroon, letterSpacing: 3, fontWeight: '700',
    marginTop: scale(16), textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1,
  },
});

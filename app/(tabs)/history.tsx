import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { T } from '../../constants/strings';
import { COLORS, scale } from '../../constants/theme';
import TempleBackground from '../../components/TempleBackground';
import { format, parseISO } from 'date-fns';

export default function History() {
  const store = useJapaStore();
  const t = T[store.lang];
  const hist = store.history;
  const max = Math.max(...hist.map(h => h.count), store.dailyGoal, 1);
  const best = hist.length ? Math.max(...hist.map(h => h.count)) : 0;
  const avg = hist.length ? Math.round(hist.reduce((s, h) => s + h.count, 0) / hist.length) : 0;

  return (
    <TempleBackground>
      <SafeAreaView style={st.safe}>
        <ScrollView contentContainerStyle={st.content}>
          <Text style={st.title}>{t.histTitle}</Text>
          <Text style={st.sub}>{t.histSub}</Text>

          {hist.length === 0 ? (
            <View style={st.empty}>
              <Text style={st.emptyIcon}>🪷</Text>
              <Text style={st.emptyTitle}>{t.noHistory}</Text>
              <Text style={st.emptySub}>{t.startJap}</Text>
            </View>
          ) : (
            <>
              <View style={st.summaryRow}>
                <View style={st.summaryCard}>
                  <Text style={st.summaryVal}>{best}</Text>
                  <Text style={st.summaryLabel}>{t.best}</Text>
                </View>
                <View style={st.summaryCard}>
                  <Text style={st.summaryVal}>{avg}</Text>
                  <Text style={st.summaryLabel}>{t.avg}</Text>
                </View>
                <View style={st.summaryCard}>
                  <Text style={st.summaryVal}>{hist.length}</Text>
                  <Text style={st.summaryLabel}>{t.days}</Text>
                </View>
              </View>

              <View style={st.chart}>
                {hist.slice(0, 30).map(day => (
                  <View key={day.date} style={st.row}>
                    <Text style={st.date}>{format(parseISO(day.date), 'd MMM')}</Text>
                    <View style={st.barTrack}>
                      <View style={[st.barFill, {
                        width: `${Math.round((day.count / max) * 100)}%`,
                        backgroundColor: day.goalMet ? COLORS.goldBright : COLORS.gold,
                      }]} />
                    </View>
                    <Text style={st.count}>{day.count}</Text>
                    <Text style={st.check}>{day.goalMet ? '✓' : ''}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </TempleBackground>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: scale(16), paddingBottom: scale(30) },
  title: { fontSize: scale(24), fontWeight: '700', color: COLORS.maroonDark, letterSpacing: 1 },
  sub: { fontSize: scale(12), color: COLORS.textMuted, marginBottom: scale(14) },
  empty: { alignItems: 'center', paddingTop: scale(70), gap: scale(8) },
  emptyIcon: { fontSize: scale(44) },
  emptyTitle: { fontSize: scale(16), color: COLORS.maroonDark, fontWeight: '700' },
  emptySub: { fontSize: scale(13), color: COLORS.textMuted },
  summaryRow: { flexDirection: 'row', gap: scale(10), marginBottom: scale(12) },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: scale(12), padding: scale(10), alignItems: 'center',
  },
  summaryVal: { fontSize: scale(18), fontWeight: '700', color: COLORS.maroon },
  summaryLabel: { fontSize: scale(10), color: COLORS.textMuted },
  chart: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: scale(14), padding: scale(12),
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(8), gap: scale(6) },
  date: { width: scale(52), fontSize: scale(11), color: COLORS.maroon },
  barTrack: {
    flex: 1, height: scale(14), backgroundColor: 'rgba(180,120,40,0.12)',
    borderRadius: scale(7), overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: scale(7) },
  count: { width: scale(38), fontSize: scale(11), fontWeight: '700', color: COLORS.maroonDark, textAlign: 'right' },
  check: { width: scale(14), fontSize: scale(11), color: COLORS.gold },
});

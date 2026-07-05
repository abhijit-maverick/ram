import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, Alert, Switch,
} from 'react-native';
import { useJapaStore } from '../../hooks/useJapaStore';
import { T } from '../../constants/strings';
import { COLORS, scale } from '../../constants/theme';
import TempleBackground from '../../components/TempleBackground';

const PRESETS = [11, 21, 54, 108, 216, 1008];

export default function Settings() {
  const store = useJapaStore();
  const t = T[store.lang];
  const [custom, setCustom] = useState('');

  const applyCustom = () => {
    const n = parseInt(custom);
    if (!isNaN(n) && n > 0) { store.update({ dailyGoal: n }); setCustom(''); }
  };

  return (
    <TempleBackground>
      <SafeAreaView style={st.safe}>
        <ScrollView contentContainerStyle={st.content}>
          <Text style={st.title}>{t.settings}</Text>
          <Text style={st.sub}>{t.omTatSat}</Text>

          {/* Daily goal */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>{t.dailyGoalSec}</Text>
            <Text style={st.sectionSub}>{t.currentGoal}: {store.dailyGoal}</Text>
            <View style={st.presets}>
              {PRESETS.map(g => (
                <TouchableOpacity key={g}
                  style={[st.preset, store.dailyGoal === g && st.presetActive]}
                  onPress={() => store.update({ dailyGoal: g })}>
                  <Text style={[st.presetText, store.dailyGoal === g && st.presetTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={st.customRow}>
              <TextInput
                style={st.input} placeholder={t.customGoal} placeholderTextColor="#c8a870"
                keyboardType="number-pad" value={custom} onChangeText={setCustom} />
              <TouchableOpacity style={st.applyBtn} onPress={applyCustom}>
                <Text style={st.applyText}>{t.apply}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sound & haptics */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>{t.soundSec}</Text>
            <View style={st.switchRow}>
              <Text style={st.switchLabel}>{t.milestoneSounds}</Text>
              <Switch value={store.soundOn} onValueChange={v => store.update({ soundOn: v })}
                trackColor={{ true: COLORS.gold, false: '#ccc' }} thumbColor="#fff" />
            </View>
            <View style={st.switchRow}>
              <Text style={st.switchLabel}>{t.haptics}</Text>
              <Switch value={store.hapticOn} onValueChange={v => store.update({ hapticOn: v })}
                trackColor={{ true: COLORS.gold, false: '#ccc' }} thumbColor="#fff" />
            </View>
          </View>

          {/* Language */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>{t.langSec}</Text>
            <View style={st.presets}>
              <TouchableOpacity style={[st.preset, store.lang === 'hi' && st.presetActive]}
                onPress={() => store.update({ lang: 'hi' })}>
                <Text style={[st.presetText, store.lang === 'hi' && st.presetTextActive]}>हिंदी</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.preset, store.lang === 'en' && st.presetActive]}
                onPress={() => store.update({ lang: 'en' })}>
                <Text style={[st.presetText, store.lang === 'en' && st.presetTextActive]}>English</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Vaani offline note */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>वाणी जप — Offline</Text>
            <Text style={st.note}>{t.vaaniOfflineNote}</Text>
          </View>

          {/* Data */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>{t.dataSec}</Text>
            <TouchableOpacity style={st.dangerBtn}
              onPress={() => Alert.alert('', t.resetToday + '?', [
                { text: t.cancel }, { text: t.confirm, onPress: store.resetToday },
              ])}>
              <Text style={st.dangerText}>{t.resetToday}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[st.dangerBtn, st.wipeBtn]}
              onPress={() => Alert.alert('', t.confirmWipe, [
                { text: t.cancel }, { text: t.confirm, style: 'destructive', onPress: store.wipeAll },
              ])}>
              <Text style={[st.dangerText, { color: '#fff' }]}>{t.wipeAll}</Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={st.section}>
            <Text style={st.sectionTitle}>{t.aboutSec}</Text>
            <Text style={st.note}>{t.version}</Text>
            <Text style={st.om}>ॐ</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TempleBackground>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: scale(16), paddingBottom: scale(30) },
  title: { fontSize: scale(24), fontWeight: '700', color: COLORS.maroonDark },
  sub: { fontSize: scale(12), color: COLORS.textMuted, letterSpacing: 3, marginBottom: scale(12) },
  section: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: scale(14), padding: scale(14), marginBottom: scale(12),
  },
  sectionTitle: { fontSize: scale(15), fontWeight: '700', color: COLORS.maroonDark, marginBottom: scale(6) },
  sectionSub: { fontSize: scale(12), color: COLORS.textMuted, marginBottom: scale(10) },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8) },
  preset: {
    paddingHorizontal: scale(18), paddingVertical: scale(8), borderRadius: 999,
    backgroundColor: 'rgba(180,120,40,0.1)', borderWidth: 1, borderColor: COLORS.border,
  },
  presetActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  presetText: { fontSize: scale(14), color: COLORS.maroon, fontWeight: '600' },
  presetTextActive: { color: '#fff' },
  customRow: { flexDirection: 'row', gap: scale(8), marginTop: scale(10) },
  input: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: scale(10),
    paddingHorizontal: scale(12), paddingVertical: scale(8),
    fontSize: scale(14), color: COLORS.maroonDark, backgroundColor: '#fff',
  },
  applyBtn: {
    paddingHorizontal: scale(16), justifyContent: 'center',
    backgroundColor: COLORS.maroon, borderRadius: scale(10),
  },
  applyText: { color: '#fff', fontWeight: '700', fontSize: scale(13) },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: scale(4) },
  switchLabel: { fontSize: scale(13), color: COLORS.maroonDark },
  note: { fontSize: scale(12), color: COLORS.textMuted, lineHeight: scale(19) },
  dangerBtn: {
    borderWidth: 1, borderColor: COLORS.gold, borderRadius: scale(10),
    paddingVertical: scale(10), alignItems: 'center', marginBottom: scale(8),
  },
  wipeBtn: { backgroundColor: '#a33', borderColor: '#a33' },
  dangerText: { fontSize: scale(13), color: COLORS.maroon, fontWeight: '600' },
  om: { fontSize: scale(24), color: COLORS.gold, textAlign: 'center', marginTop: scale(6) },
});

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { COLORS, scale } from '../constants/theme';

const PETAL_COLORS = ['#FFB7C5', '#FF8FA3', '#FFC8A2', '#FFD700', '#FFA500', '#ee86ae'];

export function FloatingRam({ x, y, text, onDone }: { x: number; y: number; text: string; onDone: () => void }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(op, { toValue: 1, duration: 170, useNativeDriver: true }),
        Animated.delay(380),
        Animated.timing(op, { toValue: 0, duration: 560, useNativeDriver: true }),
      ]),
      Animated.timing(ty, { toValue: -scale(120), duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1.08, tension: 180, friction: 8, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: x, top: y, opacity: op, transform: [{ translateY: ty }, { scale: sc }], zIndex: 60 }}>
      <Text style={st.ram}>{text}</Text>
    </Animated.View>
  );
}

export function FloatingPetal({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const tx = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  const dir = Math.random() > 0.5 ? 1 : -1;
  const size = scale(13 + Math.random() * 9);

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.delay(430),
        Animated.timing(op, { toValue: 0, duration: 620, useNativeDriver: true }),
      ]),
      Animated.timing(ty, { toValue: -scale(150), duration: 1250, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(tx, { toValue: dir * scale(24), duration: 620, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(tx, { toValue: dir * -scale(12), duration: 630, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
      Animated.timing(rot, { toValue: 1, duration: 1250, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  const spin = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${dir * 200}deg`] });

  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: x, top: y, opacity: op, transform: [{ translateY: ty }, { translateX: tx }, { rotate: spin }], zIndex: 55 }}>
      <Svg width={size} height={size * 1.4} viewBox="0 0 20 28">
        <Path d="M10 2 C14 2, 18 8, 18 14 C18 20, 14 26, 10 26 C6 26, 2 20, 2 14 C2 8, 6 2, 10 2 Z" fill={color} opacity={0.92} />
        <Path d="M10 4 L10 24" stroke="rgba(140,55,40,0.35)" strokeWidth={0.8} fill="none" />
        <Ellipse cx={7} cy={10} rx={2} ry={4} fill="rgba(255,255,255,0.32)" />
      </Svg>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  ram: {
    fontSize: scale(21), fontWeight: '700', color: '#8B2500', letterSpacing: 2,
    textShadowColor: 'rgba(255,200,100,0.65)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
});

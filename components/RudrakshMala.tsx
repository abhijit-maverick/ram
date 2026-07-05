import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { MALA } from '../constants/theme';

interface Props { count: number; spinTick: number; }

const N = MALA.beadCount;
const S = MALA.ringSize;
const R = S / 2;
const BEAD_R = R * 0.062;

export default function RudrakshMala({ count, spinTick }: Props) {
  const rot = useRef(new Animated.Value(0)).current;
  const target = useRef(0);

  useEffect(() => {
    if (spinTick === 0) return;
    target.current += 360 / N;
    Animated.timing(rot, {
      toValue: target.current, duration: 550,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, [spinTick]);

  const rotate = rot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const lit = count % N;

  return (
    <Animated.View style={{ width: S, height: S, transform: [{ rotate }] }}>
      <Svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <Defs>
          <RadialGradient id="lit" cx="32%" cy="28%" r="72%">
            <Stop offset="0%" stopColor="#e8b96a" />
            <Stop offset="45%" stopColor="#9B6B1A" />
            <Stop offset="100%" stopColor="#4A2800" />
          </RadialGradient>
          <RadialGradient id="dark" cx="32%" cy="28%" r="72%">
            <Stop offset="0%" stopColor="#6b3a16" />
            <Stop offset="55%" stopColor="#3a1c08" />
            <Stop offset="100%" stopColor="#170a02" />
          </RadialGradient>
          <RadialGradient id="meru" cx="32%" cy="28%" r="72%">
            <Stop offset="0%" stopColor="#ffe9ad" />
            <Stop offset="45%" stopColor="#e2a936" />
            <Stop offset="100%" stopColor="#9a6a14" />
          </RadialGradient>
        </Defs>
        <Circle cx={R} cy={R} r={R * 0.86} fill="none" stroke="rgba(139,94,26,0.3)" strokeWidth={1.5} />
        {Array.from({ length: N }, (_, i) => {
          const a = (i / N) * 2 * Math.PI - Math.PI / 2;
          const x = R + R * 0.86 * Math.cos(a);
          const y = R + R * 0.86 * Math.sin(a);
          const isMeru = i === 0;
          const isLit = i < lit;
          const r = isMeru ? BEAD_R * 1.45 : BEAD_R;
          return (
            <G key={i}>
              <Circle cx={x + r * 0.22} cy={y + r * 0.3} r={r} fill="rgba(60,25,0,0.35)" />
              <Circle cx={x} cy={y} r={r}
                fill={isMeru ? 'url(#meru)' : isLit ? 'url(#lit)' : 'url(#dark)'}
                stroke={isLit || isMeru ? '#F0A830' : '#3A1500'} strokeWidth={isMeru ? 1.2 : 0.6} />
              <Circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.26} fill="rgba(255,255,255,0.28)" />
              {!isMeru && <Circle cx={x} cy={y} r={r * 0.45} fill="none" stroke="rgba(30,10,0,0.3)" strokeWidth={0.5} />}
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

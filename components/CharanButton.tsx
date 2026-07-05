import React, { useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { COLORS, MALA, scale } from '../constants/theme';

interface Props { onPress: () => void; label: string; }

const D = MALA.charanSize;

export default function CharanButton({ onPress, label }: Props) {
  const breathe = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breathe, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);

  const handle = () => {
    Animated.sequence([
      Animated.timing(press, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.spring(press, { toValue: 1, tension: 220, friction: 6, useNativeDriver: true }),
    ]).start();
    ripple.setValue(0);
    Animated.timing(ripple, { toValue: 1, duration: 750, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    onPress();
  };

  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] });
  const ripScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 2] });
  const ripOpacity = ripple.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.7, 0] });

  return (
    <View style={{ width: D * 1.35, height: D * 1.35, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[st.ripple, {
        width: D, height: D, borderRadius: D / 2,
        transform: [{ scale: ripScale }], opacity: ripOpacity,
      }]} />
      <Animated.View style={[st.glow, {
        width: D + scale(20), height: D + scale(20), borderRadius: (D + scale(20)) / 2,
        transform: [{ scale: glowScale }], opacity: glowOpacity,
      }]} />
      <Animated.View style={{ transform: [{ scale: press }] }}>
        <TouchableOpacity activeOpacity={0.92} onPress={handle}
          style={[st.btn, { width: D, height: D, borderRadius: D / 2 }]}>
          <Image
            source={require('../assets/images/ram_charan.png')}
            style={{ position: 'absolute', left: D * 0.13, top: D * 0.07, width: D * 0.74, height: D * 0.74 }}
            resizeMode="contain"
          />
          <View style={[st.innerShadow, { borderRadius: D / 2 }]} />
          <Text style={st.label}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  btn: {
    borderWidth: 3, borderColor: COLORS.gold, overflow: 'hidden',
    backgroundColor: '#fdeecb',
    alignItems: 'center', justifyContent: 'flex-end',
    elevation: 10, shadowColor: COLORS.goldBright,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 14,
  },
  glow: {
    position: 'absolute', borderWidth: 2,
    borderColor: 'rgba(240,168,48,0.55)',
    backgroundColor: 'rgba(255,206,110,0.18)',
  },
  ripple: {
    position: 'absolute', borderWidth: 2.5,
    borderColor: 'rgba(240,168,48,0.8)',
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: scale(12), color: COLORS.maroon, letterSpacing: 3,
    marginBottom: scale(9), fontWeight: '600',
    textShadowColor: 'rgba(255,255,255,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});

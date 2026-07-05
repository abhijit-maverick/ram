import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ImageBackground } from 'react-native';
import { COLORS } from '../constants/theme';

// Uses the approved AI temple image + warm overlay + animated diya glow,
// matching the mood of the approved HTML design.
export default function TempleBackground({ children }: { children: React.ReactNode }) {
  const flicker = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(flicker, { toValue: 0.75, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(flicker, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/temple_bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      {/* subtle animated warm glow, like diya light breathing */}
      <Animated.View pointerEvents="none" style={[styles.glow, { opacity: flicker }]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(253,243,227,0.55)' },
  glow: {
    position: 'absolute', top: '25%', left: '10%', right: '10%', height: '40%',
    borderRadius: 999, backgroundColor: 'rgba(255,206,110,0.14)',
  },
});

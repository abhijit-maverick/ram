import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS, scale } from '../../constants/theme';

function Icon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: scale(20), opacity: focused ? 1 : 0.45 }}>{label}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'rgba(253,243,227,0.97)',
        borderTopColor: 'rgba(180,120,40,0.25)', borderTopWidth: 1,
        height: scale(62), paddingBottom: scale(8), paddingTop: scale(5),
      },
      tabBarActiveTintColor: COLORS.maroon,
      tabBarInactiveTintColor: '#c8b090',
      tabBarLabelStyle: { fontSize: scale(9), letterSpacing: 1, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'जप', tabBarIcon: ({ focused }) => <Icon label="🪷" focused={focused} /> }} />
      <Tabs.Screen name="history" options={{ title: 'इतिहास', tabBarIcon: ({ focused }) => <Icon label="📿" focused={focused} /> }} />
      <Tabs.Screen name="streak" options={{ title: 'अनुक्रम', tabBarIcon: ({ focused }) => <Icon label="🔥" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'सेटिंग', tabBarIcon: ({ focused }) => <Icon label="⚙️" focused={focused} /> }} />
    </Tabs>
  );
}

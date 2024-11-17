import { Tabs } from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
          borderTopColor: 'transparent',
          height: 60,
        },
        tabBarActiveTintColor: Theme.colors.action,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Buzz',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.colors.textPrimary,
            fontSize: Theme.sizes.textMedium,
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.colors.textPrimary,
            fontSize: Theme.sizes.textMedium,
            fontWeight: 'bold',
          },
        }}
      />
    </Tabs>
  );
}

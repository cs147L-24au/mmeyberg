import { Stack } from 'expo-router';
import Theme from "@/assets/theme";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages',
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
      {/* You can add more screens here, for example for individual conversations */}
    </Stack>
  );
}

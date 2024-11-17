import { Stack } from 'expo-router';
import Theme from "@/assets/theme";

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Feed',
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
      <Stack.Screen
        name="newpost"
        options={{
          presentation: 'modal',
          title: 'New Post',
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
      <Stack.Screen
        name="details"
        options={{
          title: 'Comments',
          headerTintColor: Theme.colors.textPrimary,
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
    </Stack>
  );
}

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        contentStyle: { backgroundColor: '#FFA500' }, // Orange color
      }}
    />
  );
}

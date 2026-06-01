// app/recomendaciones/_layout.tsx
import { Stack } from 'expo-router'

export default function RecomendacionesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ejercicio" />
    </Stack>
  )
}
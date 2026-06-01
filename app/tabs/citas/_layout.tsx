import { Stack } from 'expo-router'

export default function CitasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* index será tu Agenda */}
      <Stack.Screen name="index"/> 
      {/* crearCita será el formulario */}
      <Stack.Screen name="crearCita" />
    </Stack>
  )
}
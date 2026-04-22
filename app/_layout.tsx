import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '../context/AuthContext'

function RootLayoutNav() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === 'autentificacion'

    if (!session && !inAuthGroup) {
      // Sin sesión → login
      router.replace('/autentificacion/login')
    } else if (session && inAuthGroup) {
      // Con sesión → home
      router.replace('/tabs/home')
    }
  }, [session, loading])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="autentificacion" />
      <Stack.Screen name="tabs" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { initDatabase } from '../lib/database' //Importamos la BD

function RootLayoutNav() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  
  // Estado para saber si SQLite está listo
  const [dbReady, setDbReady] = useState(false) 

  // Inicializamos las tablas al abrir la app
  useEffect(() => {
    async function setupDb() {
      await initDatabase()
      setDbReady(true)
    }
    setupDb()
  }, [])

  useEffect(() => {
    //Ahora también esperamos a que dbReady sea true
    if (loading || !dbReady) return 

    const inAuthGroup = segments[0] === 'autentificacion'

    if (!session && !inAuthGroup) {
      router.replace('/autentificacion/login')
    } else if (session && inAuthGroup) {
      router.replace('/tabs/home')
    }
  }, [session, loading, dbReady, segments])

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
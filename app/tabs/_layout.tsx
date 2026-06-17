import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Mantiene oculta la cabecera gris por defecto
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textHint,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      
      {/* Movimos 'citas' al medio por ser la función principal de la app */}
      <Tabs.Screen 
        name="citas" 
        options={{ 
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'tab-agenda',
        }} 
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />

      {/* EL TRUCO DE LA PESTAÑA OCULTA:
        Al poner href: null, Expo Router sabe que esta ruta pertenece a los Tabs
        (por lo que el menú inferior no desaparece), pero NO dibuja un 4to ícono.
      */}
      <Tabs.Screen 
        name="recomendaciones" 
        options={{ 
          href: null, // Esto es lo que lo oculta de la barra visual
          headerShown: false 
        }} 
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.cardBg,
    borderTopWidth: 0, // Quitamos la línea plana para usar una sombra moderna
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryDark || '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  }
})
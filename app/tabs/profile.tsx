import {
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useAuth } from '../../context/AuthContext' // <-- Añadido
import { useUsuario } from '../../hooks/useUsuario'
import { useAuthActions } from '../../hooks/useAuth'
import { getPacienteUsuario } from '../../services/pacienteService' // <-- Añadido
import { Infante } from '../../schemas/pacient_inf.types' // <-- Añadido
import { Colors } from '../../constants/colors'

// Formatea fecha de 'YYYY-MM-DD' a 'DD/MM/YYYY'
function formatDate(date: any): string {
  if (!date) return 'No indicado'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return 'Error en fecha'
  }
}

function DataRow({ label, value, iconName, last = false }: { label: string; value: string; iconName: keyof typeof Ionicons.glyphMap; last?: boolean }) {
  return (
    <View style={[styles.dataRow, !last && styles.dataRowBorder]}>
      <View style={styles.dataLabelContainer}>
        <Ionicons name={iconName} size={18} color={Colors.textSecondary} style={styles.rowIcon} />
        <Text style={styles.dataLabel}>{label}</Text>
      </View>
      <Text style={styles.dataValue} numberOfLines={2}>{value}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useAuth() // Sesión activa
  const { usuario, loading, error } = useUsuario() // Datos de perfil del tutor
  const { handleLogout } = useAuthActions()

  // Estado para el paciente vinculado
  const [paciente, setPaciente] = useState<Infante | null>(null)
  const [loadingPaciente, setLoadingPaciente] = useState(true)

  // Cargar el paciente vinculado al iniciar la pantalla
  useEffect(() => {
    async function fetchPaciente() {
      if (!user) return
      try {
        const infante = await getPacienteUsuario(user.id)
        setPaciente(infante)
      } catch (error) {
        console.error("Error al cargar paciente en perfil:", error)
      } finally {
        setLoadingPaciente(false)
      }
    }
    fetchPaciente()
  }, [user])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  if (error || !usuario) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} style={{marginBottom: 16}} />
        <Text style={styles.errorText}>{error ?? 'No se pudo cargar el perfil'}</Text>
      </View>
    )
  }

  return (
    <View style={styles.mainWrapper}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Cabecera de Perfil */}
        <View style={styles.heroSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario.fullname.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{usuario.fullname}</Text>
          <Text style={styles.profileUsername}>@{usuario.username}</Text>
        </View>

        {/* Sección: Gestión de Pacientes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Expedientes Familiares</Text>
          </View>
          
          {loadingPaciente ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{marginBottom: 16}} />
          ) : paciente ? (
            // Mini-tarjeta del paciente vinculado
            <View style={styles.pacienteItem}>
              <View style={styles.pacienteIconCircle}>
                <Ionicons name="person" size={24} color={Colors.primaryDark} />
              </View>
              <View style={styles.pacienteInfo}>
                <Text style={styles.pacienteName}>{paciente.nombre}</Text>
                <Text style={styles.pacienteId}>ID: {paciente.id.substring(0, 8).toUpperCase()}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
            </View>
          ) : (
            <Text style={styles.cardDescription}>
              No tienes ningún expediente vinculado actualmente.
            </Text>
          )}

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/patient/vincularPaciente')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.actionButtonText}>
              {paciente ? "Vincular otro paciente" : "Vincular paciente"}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primaryDark} style={{marginLeft: 'auto'}} />
          </TouchableOpacity>
        </View>

        {/* Datos de la Cuenta */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Información de Acceso</Text>
          </View>
          <DataRow iconName="mail-outline" label="Correo electrónico" value={usuario.email} />
          <DataRow iconName="call-outline" label="Teléfono" value={usuario.phone} last />
        </View>

        {/* Datos Personales y Relación */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Detalles Personales</Text>
          </View>
          <DataRow iconName="heart-outline" label="Relación con paciente" value={String(usuario.relation_pacien)} />
          <DataRow iconName="calendar-outline" label="Nacimiento" value={formatDate(usuario.fecha_nacimiento)} />
          <DataRow iconName="male-female-outline" label="Género" value={usuario.gender} />
          <DataRow iconName="location-outline" label="Dirección" value={usuario.address} last />
        </View>

        {/* Botón de Salida */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Equilibra App v1.0.0</Text>
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 40, gap: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 12, color: Colors.textSecondary, fontWeight: '500' },
  errorText: { color: Colors.danger, textAlign: 'center', fontWeight: '600', fontSize: 16 },

  heroSection: { alignItems: 'center', marginBottom: 8 },
  avatar: { 
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primaryLight, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 6 } })
  },
  avatarText: { color: Colors.primaryDark, fontSize: 40, fontWeight: '900' },
  profileName: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  profileUsername: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500', marginTop: 4 },

  card: { 
    backgroundColor: Colors.cardBg, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }, android: { elevation: 1 } })
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark, letterSpacing: 0.5 },
  cardDescription: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 20 },

  /* ESTILOS DEL PACIENTE VINCULADO */
  pacienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  pacienteIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pacienteId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  dataRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  dataLabelContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 10 },
  dataLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  dataValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', flex: 1.5, textAlign: 'right' },

  actionButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, gap: 8,
  },
  actionButtonText: { color: Colors.primaryDark, fontWeight: '700', fontSize: 14 },

  logoutBtn: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FEF2F2', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', marginTop: 8, gap: 8
  },
  logoutText: { color: Colors.danger, fontWeight: '800', fontSize: 15 },
  
  versionText: { textAlign: 'center', color: Colors.textHint, fontSize: 12, marginTop: 16, fontWeight: '500' }
})
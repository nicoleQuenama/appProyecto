import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { useUsuario } from '../../hooks/useUsuario'
import { useAuthActions } from '../../hooks/useAuth'
import { Colors } from '../../constants/colors'

// Formatea fecha de 'YYYY-MM-DD' a 'DD/MM/YYYY'
function formatDate(date: any): string {
  if (!date) return 'No indicado'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('es-BO')
  } catch {
    return 'Error en fecha'
  }
}

// Componente para cada fila de información
function DataRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.dataRow, !last && styles.dataRowBorder]}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue} numberOfLines={2}>{value}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { usuario, loading, error } = useUsuario()
  const { handleLogout } = useAuthActions()

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
        <Text style={styles.errorText}>{error ?? 'No se pudo cargar el perfil'}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
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

      {/* Datos de la Cuenta */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardDot} />
          <Text style={styles.cardTitle}>Información de Acceso</Text>
        </View>
        <DataRow label="Correo electrónico" value={usuario.email} />
        <DataRow label="Teléfono" value={usuario.phone} last />
      </View>

      {/* Datos Personales y Relación */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardDot, { backgroundColor: Colors.secondary }]} />
          <Text style={[styles.cardTitle, { color: Colors.secondary }]}>Detalles Personales</Text>
        </View>
        <DataRow label="Relación con paciente" value={String(usuario.relation_pacien)} />
        <DataRow label="Fecha de nacimiento" value={formatDate(usuario.fecha_nacimiento)} />
        <DataRow label="Género" value={usuario.gender} />
        <DataRow label="Dirección" value={usuario.address} last />
      </View>

      {/* Botón de Salida */}
      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Equilibra App v1.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, gap: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: Colors.textSecondary },
  errorText: { color: Colors.danger, textAlign: 'center' },
  heroSection: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 90, height: 90, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: Colors.primaryDark },
  profileUsername: { fontSize: 16, color: Colors.primary, marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  cardDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  cardTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: Colors.primaryDark },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  dataRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  dataLabel: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  dataValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right' },
  logoutBtn: { backgroundColor: 'white', padding: 16, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA', marginTop: 10 },
  logoutText: { color: Colors.danger, fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: Colors.textHint, fontSize: 12, marginTop: 10 }
})
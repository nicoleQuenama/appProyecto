import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { useProfile } from '../../hooks/useUsuario'
import { useAuthActions } from '../../hooks/useAuth'
import { Colors } from '../../constants/colors'

// Formatea fecha de 'YYYY-MM-DD' a 'DD/MM/YYYY'
function formatDate(date: string | null): string {
  if (!date) return 'No indicado'
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

// Formatea género a texto legible
function formatGender(gender: string | null): string {
  const map: Record<string, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    otro: 'Otro',
    prefiero_no_decir: 'Prefiero no decir',
  }
  return gender ? (map[gender] ?? gender) : 'No indicado'
}

// Formatea fecha ISO a mes y año
function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
  })
}

// Componente reutilizable para cada fila de datos
function DataRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <View style={[styles.dataRow, !last && styles.dataRowBorder]}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue} numberOfLines={1}>{value}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { profile, loading, error } = useProfile()
  const { handleLogout } = useAuthActions()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  if (error || !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'No se pudo cargar el perfil'}</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Sección de avatar y nombre */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.full_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          {/* Indicador verde de activo */}
          <View style={styles.activeIndicator} />
        </View>

        <Text style={styles.profileName}>{profile.full_name}</Text>
        <Text style={styles.profileUsername}>@{profile.username}</Text>

        <View style={styles.joinBadge}>
          <Text style={styles.joinBadgeText}>
            Miembro desde {formatJoinDate(profile.created_at)}
          </Text>
        </View>
      </View>

      {/* Card de datos de contacto */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardDot} />
          <Text style={styles.cardTitle}>Datos de contacto</Text>
        </View>

        <DataRow label="Nombre completo" value={profile.full_name} />
        <DataRow label="Usuario" value={`@${profile.username}`} />
        <DataRow label="Correo" value={profile.email} last />
      </View>

      {/* Card de información personal */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardDot, { backgroundColor: Colors.secondary }]} />
          <Text style={[styles.cardTitle, { color: Colors.secondary }]}>
            Información personal
          </Text>
        </View>

        <DataRow
          label="Teléfono"
          value={profile.phone ?? 'No indicado'}
        />
        <DataRow
          label="Fecha de nacimiento"
          value={formatDate(profile.birth_date)}
        />
        <DataRow
          label="Género"
          value={formatGender(profile.gender)}
          last
        />
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Versión de la app al pie */}
      <Text style={styles.versionText}>Equilibra v1.0.0</Text>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryMid,
    borderWidth: 2.5,
    borderColor: Colors.background,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },
  profileUsername: {
    fontSize: 15,
    color: Colors.primary,
    marginTop: 3,
    fontWeight: '500',
  },
  joinBadge: {
    marginTop: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  joinBadgeText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dataLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  logoutBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 4,
  },
})
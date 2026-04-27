import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { getProfile } from '../../services/usuarioService'
import { getRecentAlerts, markAlertAsRead } from '../../services/alertService'
import { Profile } from '../../schemas/profile.types'
import { Alert } from '../../schemas/alert.types'
import { Colors } from '../../constants/colors'

const ALERT_CONFIG: Record<
  Alert['alert_type'],
  { label: string; color: string; bgColor: string }> = {
  low_battery: {
    label: 'Batería baja',
    color: Colors.warning,
    bgColor: Colors.warningLight,
  },
  abnormal_pressure: {
    label: 'Presión anormal',
    color: Colors.danger,
    bgColor: Colors.dangerLight,
  },
  specialist_message: {
    label: 'Mensaje del especialista',
    color: Colors.secondary,
    bgColor: Colors.secondaryLight,
  },
  inactivity: {
    label: 'Inactividad detectada',
    color: Colors.textSecondary,
    bgColor: Colors.primaryLight,
  },
}

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProfile(), getRecentAlerts()])
      .then(([prof, alts]) => {
        setProfile(prof)
        setAlerts(alts)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleAlertPress(alertId: string) {
    await markAlertAsRead(alertId)
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
    )
  }

  function formatAlertDate(iso: string) {
    const date = new Date(iso)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) {
      return `Hoy, ${date.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }
    return date.toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const firstName = profile?.full_name.split(' ')[0] ?? 'Tutor'
  const unreadCount = alerts.filter((a) => !a.is_read).length

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.summaryTitle}>Resumen del día</Text>
            <Text style={styles.summarySubtitle}>
              {new Date().toLocaleDateString('es-BO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount} {unreadCount === 1 ? 'alerta' : 'alertas'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.summaryDivider} />
        <Text style={styles.summaryDescription}>
          {unreadCount > 0
            ? `Tienes ${unreadCount} alerta${unreadCount > 1 ? 's' : ''} sin revisar de tu paciente.`
            : 'Todo está en orden. No hay alertas pendientes por revisar.'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alertas recientes</Text>
          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrapper}>
              <Text style={styles.emptyIconText}>✓</Text>
            </View>
            <Text style={styles.emptyTitle}>Sin alertas pendientes</Text>
            <Text style={styles.emptySubtitle}>
              Todo marcha bien con tu paciente
            </Text>
          </View>
        ) : (
          alerts.map((alert) => {
            const config = ALERT_CONFIG[alert.alert_type]
            return (
              <TouchableOpacity
                key={alert.id}
                style={[
                  styles.alertCard,
                  !alert.is_read && styles.alertCardUnread,
                ]}
                onPress={() => handleAlertPress(alert.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.alertTag, { backgroundColor: config.bgColor }]}>
                  <Text style={[styles.alertTagText, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
                <Text style={[
                  styles.alertMessage,
                  !alert.is_read && styles.alertMessageUnread,
                ]}>
                  {alert.message}
                </Text>
                <View style={styles.alertFooter}>
                  <Text style={styles.alertDate}>
                    {formatAlertDate(alert.created_at)}
                  </Text>
                  {!alert.is_read && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </View>
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
    paddingTop: 60,
    paddingBottom: 40,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  summarySubtitle: {
    fontSize: 12,
    color: Colors.primaryBorder,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  unreadBadge: {
    backgroundColor: Colors.primaryMid,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.primaryMid,
    opacity: 0.3,
    marginVertical: 14,
  },
  summaryDescription: {
    fontSize: 14,
    color: Colors.primaryBorder,
    lineHeight: 20,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  emptyIconText: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 8,
  },
  alertCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  alertTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertTagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  alertMessageUnread: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertDate: {
    fontSize: 12,
    color: Colors.textHint,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
})
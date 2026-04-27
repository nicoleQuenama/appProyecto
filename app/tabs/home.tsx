import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { getPacienteUsuario } from '../../services/pacienteService'
import { getReportes } from '../../services/reporteService'
import { getProximasCitas } from '../../services/citaService'

// Importamos tus nuevos esquemas
import { Infante } from '../../schemas/pacient_inf.types'
import { Reportes } from '../../schemas/reportes.types'
import { Cita } from '../../schemas/citas.types'
import { Colors } from '../../constants/colors'

export default function HomeScreen() {
  const { user } = useAuth() // Sacamos el usuario logueado de tu contexto
  const router = useRouter()
  
  // Estados para nuestra nueva estructura
  const [loading, setLoading] = useState(true)
  const [paciente, setPaciente] = useState<Infante | null>(null)
  const [reportes, setReportes] = useState<Reportes[]>([])
  const [citas, setCitas] = useState<Cita[]>([])

  useEffect(() => {
    async function cargarDatos() {
      if (!user) return; // Si no hay usuario, no hacemos nada

      try {
        setLoading(true)
        
        // 1. Buscamos al infante vinculado a este usuario
        const infante = await getPacienteUsuario(user.id)
        setPaciente(infante)

        // 2. Si el infante existe, traemos sus citas y reportes al mismo tiempo
        if (infante) {
          const [reps, appts] = await Promise.all([
            getReportes(infante.id),
            getProximasCitas(infante.id)
          ])
          setReportes(reps)
          setCitas(appts)
        }
      } catch (error) {
        console.error("Error cargando el Home:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [user])

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
      {/* Cabecera */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.name}>{paciente ? paciente.nomtuto : 'Tutor'}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push('/tabs/profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>
            {paciente ? paciente.nomtuto.charAt(0).toUpperCase() : 'T'}
          </Text>
        </TouchableOpacity>
      </View>

      {!paciente ? (
        /* Pantalla si aún no vincula a un niño */
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>¡Hola!</Text>
          <Text style={styles.emptySubtitle}>Aún no has registrado a tu paciente infantil. Por favor, vincula a un niño para ver su progreso.</Text>
        </View>
      ) : (
        <>
          {/* Resumen del Infante */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Paciente: {paciente.nombre}</Text>
            <Text style={styles.summarySubtitle}>
              Edad: {paciente.edad} años | Peso: {paciente.peso} kg
            </Text>
            {paciente.problemas_salud && (
              <Text style={styles.summaryAlert}>
                Atención: {paciente.problemas_salud}
              </Text>
            )}
          </View>

          {/* Sección: Próximas Citas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            {citas.length === 0 ? (
              <Text style={styles.emptyText}>No hay citas programadas.</Text>
            ) : (
              citas.map((cita) => (
                <View key={cita.id} style={styles.itemCard}>
                  <Text style={styles.itemTitle}>Especialista: {cita.especialista}</Text>
                  <Text style={styles.itemDetail}>
                    Fecha: {new Date(cita.fecha_hor).toLocaleDateString()}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{cita.estado}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Sección: Reportes Recientes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportes del Doctor</Text>
            {reportes.length === 0 ? (
              <Text style={styles.emptyText}>No hay reportes recientes.</Text>
            ) : (
              reportes.map((reporte) => (
                <View key={reporte.id} style={[styles.itemCard, styles.reportBorder]}>
                  <Text style={styles.itemTitle}>Progreso: {reporte.indicador_progreso}</Text>
                  <Text style={styles.itemDetail}>{reporte.notas_doctor}</Text>
                  <Text style={styles.dateText}>
                    Sesión: {new Date(reporte.fecha_Sesion).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background, gap: 12 },
  loadingText: { fontSize: 14, color: Colors.textSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  name: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, letterSpacing: -0.5 },
  avatarBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  emptyCard: { backgroundColor: Colors.cardBg, borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.primaryDark, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  summaryCard: { backgroundColor: Colors.primaryDark, borderRadius: 24, padding: 22, marginBottom: 28 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  summarySubtitle: { fontSize: 13, color: Colors.primaryBorder, marginTop: 4 },
  summaryAlert: { marginTop: 10, color: Colors.warning, fontWeight: '600', fontSize: 13 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.primaryDark, marginBottom: 12 },
  itemCard: { backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  reportBorder: { borderLeftWidth: 4, borderLeftColor: Colors.secondary },
  itemTitle: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },
  itemDetail: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  dateText: { fontSize: 12, color: Colors.textHint, marginTop: 8 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  statusText: { fontSize: 11, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  emptyText: { color: Colors.textHint, fontStyle: 'italic', fontSize: 14 }
})
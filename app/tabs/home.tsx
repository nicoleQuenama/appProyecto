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

import { Infante } from '../../schemas/pacient_inf.types'
import { Reportes } from '../../schemas/reportes.types'
import { Cita } from '../../schemas/citas.types'
import { Colors } from '../../constants/colors'

export default function HomeScreen() {
  const { user } = useAuth() 
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [paciente, setPaciente] = useState<Infante | null>(null)
  const [reportes, setReportes] = useState<Reportes[]>([])
  const [citas, setCitas] = useState<Cita[]>([])

  useEffect(() => {
    async function cargarDatos() {
      if (!user) return; 

      try {
        setLoading(true)
        const infante = await getPacienteUsuario(user.id)
        setPaciente(infante)

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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.name}>{paciente ? paciente.nomtuto : 'Tutor'}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/tabs/profile')}>
          <Text style={styles.avatarText}>{paciente ? paciente.nomtuto.charAt(0).toUpperCase() : 'T'}</Text>
        </TouchableOpacity>
      </View>

      {!paciente ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>¡Hola!</Text>
          <Text style={styles.emptySubtitle}>Aún no has registrado a tu paciente. Por favor, vincúlalo para ver su progreso.</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/tabs/registrarPaciente')}>
            <Text style={styles.btnText}>Registrar Paciente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Paciente: {paciente.nombre}</Text>
            <Text style={styles.summarySubtitle}>Edad: {paciente.edad} años | Peso: {paciente.peso} kg</Text>
            {paciente.problemas_salud && <Text style={styles.summaryAlert}>Atención: {paciente.problemas_salud}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            {citas.length === 0 ? <Text style={styles.emptyText}>No hay citas programadas.</Text> : (
              citas.map((cita) => (
                <View key={cita.id} style={styles.itemCard}>
                  <Text style={styles.itemTitle}>Especialista: {cita.especialista}</Text>
                  <Text style={styles.itemDetail}>Fecha: {new Date(cita.fecha_hor).toLocaleDateString()}</Text>
                  <View style={styles.statusBadge}><Text style={styles.statusText}>{cita.estado}</Text></View>
                </View>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportes del Doctor</Text>
            {reportes.length === 0 ? <Text style={styles.emptyText}>No hay reportes recientes.</Text> : (
              reportes.map((reporte) => (
                <View key={reporte.id} style={[styles.itemCard, styles.reportBorder]}>
                  <Text style={styles.itemTitle}>Progreso: {reporte.indicador_progreso}</Text>
                  <Text style={styles.itemDetail}>{reporte.notas_doctor}</Text>
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
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: Colors.textSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  name: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  avatarBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  emptyCard: { backgroundColor: 'white', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 15 },
  btnPrimary: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: 'bold' },
  summaryCard: { backgroundColor: Colors.primaryDark, borderRadius: 24, padding: 22, marginBottom: 24 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  summarySubtitle: { color: Colors.primaryBorder, marginTop: 4 },
  summaryAlert: { marginTop: 10, color: Colors.warning, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 12 },
  itemCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  reportBorder: { borderLeftWidth: 4, borderLeftColor: Colors.secondary },
  itemTitle: { fontWeight: 'bold', color: Colors.primaryDark },
  itemDetail: { color: Colors.textSecondary, marginTop: 4 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: Colors.primaryLight, padding: 6, borderRadius: 6, marginTop: 8 },
  statusText: { fontSize: 11, color: Colors.primary, fontWeight: 'bold' },
  emptyText: { color: Colors.textHint, fontStyle: 'italic' }
})
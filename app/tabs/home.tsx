import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Platform
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { getPacienteUsuario } from '../../services/pacienteService'
import { getProximasCitas } from '../../services/citaService'

import { Infante } from '../../schemas/pacient_inf.types'
import { Cita } from '../../schemas/citas.types'
import { Colors } from '../../constants/colors'

import Card from '../../components/card'
import Button from '../../components/button'

export default function HomeScreen() {
  const { user } = useAuth() 
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [paciente, setPaciente] = useState<Infante | null>(null)
  const [citas, setCitas] = useState<Cita[]>([])

  useEffect(() => {
    async function cargarDatos() {
      if (!user) return; 

      try {
        setLoading(true)
        const infante = await getPacienteUsuario(user.id)
        setPaciente(infante)

        if (infante) {
          const appts = await getProximasCitas(infante.id)
          setCitas(appts)
        }
      } catch (error) {
        console.error("Error cargando el panel principal:", error)
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
        <Text style={styles.loadingText}>Cargando panel médico...</Text>
      </View>
    )
  }

  let nombreUsuario = 'Usuario';
  if (paciente && paciente.nomtuto) {
    nombreUsuario = paciente.nomtuto.split(' ')[0];
  } else if (user && user.email) {
    nombreUsuario = user.email.split('@')[0];
  }
  nombreUsuario = nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1);

  const citasPendientes = citas.filter(c => c.estado === 'pendiente');
  const proximaCita = citasPendientes.length > 0 ? citasPendientes[0] : null;

  return (
    <View style={styles.mainWrapper}>
      
      {/* CABECERA FIJA */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTopRow}>
          <Text style={styles.brandLogo}>EQUILIBRA</Text>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/tabs/profile')}>
            <Text style={styles.avatarText}>{nombreUsuario.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greetingTitle}>Hola, {nombreUsuario}</Text>

        {!paciente ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Configuración inicial</Text>
            <Text style={styles.emptySubtitle}>Vincula el expediente de tu paciente para acceder a los controles médicos, citas y reportes de evolución.</Text>
            <Button 
              title="Vincular expediente" 
              onPress={() => router.push('/patient/vincularPaciente')} 
            />
          </Card>
        ) : (
          <>
            {/* TARJETA DEL PACIENTE (Estilo Tarjeta Bancaria) */}
            <View style={styles.bankCardWrapper}>
              <View style={styles.bankCard}>
                <View style={styles.bankCardHeader}>
                  <View style={styles.bankCardStatusRow}>
                    <View style={styles.dotActive} />
                    <Text style={styles.bankCardType}>Expediente Activo</Text>
                  </View>
                  <Text style={styles.bankCardId}>Nº {paciente.codigo_vinculacion || '000-000'}</Text>
                </View>

                <View style={styles.bankCardBody}>
                  <Text style={styles.bankCardLabel}>Paciente Pediátrico</Text>
                  <Text style={styles.bankCardName}>{paciente.nombre}</Text>
                </View>

                <View style={styles.bankCardFooter}>
                  <Text style={styles.bankCardStats}>{paciente.edad} años • {paciente.peso} kg • {paciente.estatura} cm</Text>
                </View>
                
                {/* Alerta médica simulando un aviso de la tarjeta */}
                {paciente.problemas_salud ? (
                  <View style={styles.bankAlert}>
                    <Text style={styles.bankAlertText}>Aviso: {paciente.problemas_salud}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* SECCIÓN DE PRÓXIMA CITA (Formato lista simple) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próxima Sesión</Text>
                <TouchableOpacity onPress={() => router.push('/tabs/citas')}>
                  <Text style={styles.linkText}>Ver agenda completa</Text>
                </TouchableOpacity>
              </View>
              
              {!proximaCita ? (
                <Card style={styles.emptyItemCard}>
                  <Text style={styles.emptyText}>No hay sesiones pendientes.</Text>
                </Card>
              ) : (
                <Card style={styles.appointmentCard}>
                  <View style={styles.appointmentContent}>
                    <Text style={styles.appointmentSpecialist}>{proximaCita.especialista}</Text>
                    <Text style={styles.appointmentDate}>
                      {new Date(proximaCita.fecha_hor).toLocaleDateString('es-BO')} a las {new Date(proximaCita.fecha_hor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                  <View style={styles.badgePending}>
                    <Text style={styles.textPending}>Confirmada</Text>
                  </View>
                </Card>
              )}
            </View>

            {/* PLAN DE TRATAMIENTO (Formato Bento Grid) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Plan de Tratamiento en Casa</Text>
              
              <View style={styles.bentoGrid}>
                {/* Bento Izquierdo: Ejercicios */}
                <TouchableOpacity 
                  style={[styles.bentoCard, styles.bentoLight]}
                  activeOpacity={0.8}
                  onPress={() => router.push('/tabs/recomendaciones/ejercicio')}
                >
                  <View style={styles.bentoIconWrapperLight}>
                    <Text style={styles.bentoIconDark}>+</Text>
                  </View>
                  <View>
                    <Text style={styles.bentoTitleDark}>Ejercicios{'\n'}en casa</Text>
                    <Text style={styles.bentoSubtitleDark}>Ver rutinas</Text>
                  </View>
                </TouchableOpacity>

                {/* Bento Derecho: Evolución */}
                <TouchableOpacity 
                  style={[styles.bentoCard, styles.bentoPrimary]}
                  activeOpacity={0.8}
                  onPress={() => router.push('/patient/evolucion')}
                >
                  <View style={styles.bentoIconWrapperDark}>
                    <Text style={styles.bentoIconLight}>↗</Text>
                  </View>
                  <View>
                    <Text style={styles.bentoTitleLight}>Evolución{'\n'}Clínica</Text>
                    <Text style={styles.bentoSubtitleLight}>Ver gráficos</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
  
  /* CABECERA FIJA */
  fixedHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 60, 
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 },
      android: { elevation: 3 },
    })
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandLogo: { fontSize: 18, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 1.5 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primaryBorder },
  avatarText: { color: Colors.primaryDark, fontSize: 15, fontWeight: '700' },

  /* SCROLL Y SALUDO */
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  greetingTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: 24 },

  /* ESTADO VACÍO */
  emptyCard: { padding: 28, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 24, lineHeight: 22, fontSize: 14 },

  /* TARJETA DEL PACIENTE (ESTILO BANCO) */
  bankCardWrapper: {
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
      android: { elevation: 6 },
    })
  },
  bankCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.primaryMid, // Borde colorido tipo tarjeta moderna
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  bankCardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning, // Color dorado/ambar como en la imagen
    marginRight: 6,
  },
  bankCardType: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bankCardId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bankCardBody: {
    marginBottom: 24,
  },
  bankCardLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  bankCardName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  bankCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankCardStats: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bankAlert: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bankAlertText: {
    color: Colors.warning,
    fontWeight: '700',
    fontSize: 13,
  },

  /* SECCIONES */
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  linkText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  
  /* CITA */
  appointmentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  appointmentContent: { flex: 1 },
  appointmentSpecialist: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  appointmentDate: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  badgePending: { backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  textPending: { color: Colors.primaryDark, fontWeight: '700', fontSize: 12 },
  emptyItemCard: { backgroundColor: Colors.inputBg, alignItems: 'center', borderStyle: 'dashed', padding: 20 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },

  /* BENTO GRID (EJERCICIOS Y EVOLUCIÓN) */
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    })
  },
  bentoLight: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bentoPrimary: {
    backgroundColor: Colors.primary,
  },
  bentoIconWrapperLight: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  bentoIconWrapperDark: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  bentoIconDark: { color: Colors.primaryDark, fontSize: 20, fontWeight: 'bold' },
  bentoIconLight: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bentoTitleDark: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  bentoSubtitleDark: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  bentoTitleLight: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bentoSubtitleLight: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }
})
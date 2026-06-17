import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform,
  Modal,
  Alert
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useAuth } from '../../../context/AuthContext'
import { getPacienteUsuario } from '../../../services/pacienteService'
import { getProximasCitas } from '../../../services/citaService'

import { Infante } from '../../../schemas/pacient_inf.types'
import { Cita } from '../../../schemas/citas.types'
import { Colors } from '../../../constants/colors'

import Card from '../../../components/card'
import Button from '../../../components/button'

export default function CitasIndexScreen() {
  const { user } = useAuth() 
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [paciente, setPaciente] = useState<Infante | null>(null)
  const [citas, setCitas] = useState<Cita[]>([])
  
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)

  useEffect(() => {
    async function cargarCitas() {
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
        console.error("Error cargando las citas:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarCitas()
  }, [user])

  const obtenerMes = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[fecha.getMonth()];
  }

  const obtenerDia = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return String(fecha.getDate()).padStart(2, '0');
  }

  const obtenerHora = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const obtenerFechaCompleta = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()} ${obtenerHora(fechaStr)}`;
  }

  const handleExportar = () => {
    // TODO: Aquí se integrará la lógica de exportación a PDF a futuro
    Alert.alert(
      "Exportar Comprobante", 
      "El comprobante ha sido generado. (Esta función conectará con la generación de PDF pronto)."
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando agenda...</Text>
      </View>
    )
  }

  // Agrupamos en próximas (pendientes y confirmadas) y el historial (completadas)
  const citasProximas = citas.filter(c => c.estado === 'pendiente' || c.estado === 'confirmado');
  const citasHistorial = citas.filter(c => c.estado !== 'pendiente' && c.estado !== 'confirmado');

  return (
    <View style={styles.mainWrapper}>
      
      <View style={styles.fixedHeader}>
        <Text style={styles.headerTitle}>Agenda Médica</Text>
        <Text style={styles.headerSubtitle}>Tus próximas consultas y controles</Text>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {!paciente ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Sin paciente vinculado</Text>
            <Text style={styles.emptySubtitle}>Para agendar y ver citas, primero debes vincular el expediente de un paciente.</Text>
            <Button 
              title="Vincular expediente" 
              onPress={() => router.push('/patient/vincularPaciente')}
              testID="btn-vincular-expediente"
              accessibilityLabel="btn-vincular-expediente"
            />
          </Card>
        ) : (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Próximas sesiones</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{citasProximas.length}</Text>
              </View>
            </View>

            {citasProximas.length === 0 ? (
              <Card style={styles.emptyItemCard}>
                <Text style={styles.emptyText}>No tienes citas programadas próximamente.</Text>
              </Card>
            ) : (
              citasProximas.map((cita) => (
                <TouchableOpacity 
                  key={cita.id} 
                  activeOpacity={0.8}
                  onPress={() => setCitaSeleccionada(cita)}
                >
                  <Card style={styles.citaCard}>
                    <View style={styles.dateBlock}>
                      <Text style={styles.dateMonth}>{obtenerMes(cita.fecha_hor)}</Text>
                      <Text style={styles.dateDay}>{obtenerDia(cita.fecha_hor)}</Text>
                    </View>

                    <View style={styles.citaContent}>
                      <Text style={styles.citaSpecialist} numberOfLines={1}>
                        {cita.especialista}
                      </Text>
                      <View style={styles.citaInfoRow}>
                        <Ionicons name="time-outline" size={16} color={Colors.textSecondary} style={styles.iconMargin} />
                        <Text style={styles.citaTime}>{obtenerHora(cita.fecha_hor)}</Text>
                      </View>
                      
                      {/* ETIQUETA DINÁMICA DE ESTADO (Amarillo o Verde) */}
                      <View style={cita.estado === 'pendiente' ? styles.statusBadgeWarning : styles.statusBadgeSuccess}>
                        <Text style={cita.estado === 'pendiente' ? styles.statusTextWarning : styles.statusTextSuccess}>
                          {cita.estado === 'pendiente' ? 'Pendiente' : 'Confirmada'}
                        </Text>
                      </View>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color={Colors.borderStrong || '#CCC'} />
                  </Card>
                </TouchableOpacity>
              ))
            )}

            {/* HISTORIAL */}
            {citasHistorial.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>Historial</Text>
                {citasHistorial.map((cita) => (
                  <TouchableOpacity 
                    key={cita.id} 
                    activeOpacity={0.8}
                    onPress={() => setCitaSeleccionada(cita)}
                  >
                    <Card style={[styles.citaCard, styles.citaCardPast]}>
                      <View style={[styles.dateBlock, styles.dateBlockPast]}>
                        <Text style={styles.dateMonthPast}>{obtenerMes(cita.fecha_hor)}</Text>
                        <Text style={styles.dateDayPast}>{obtenerDia(cita.fecha_hor)}</Text>
                      </View>
                      <View style={styles.citaContent}>
                        <Text style={[styles.citaSpecialist, styles.textPast]} numberOfLines={1}>
                          {cita.especialista}
                        </Text>
                        <View style={styles.citaInfoRow}>
                          <Ionicons name="time-outline" size={16} color={Colors.textSecondary} style={styles.iconMargin} />
                          <Text style={styles.citaTime}>{obtenerHora(cita.fecha_hor)}</Text>
                        </View>
                        <View style={styles.statusBadgeCompleted}>
                          <Text style={styles.statusTextCompleted}>Completada</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.borderStrong || '#CCC'} />
                    </Card>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {paciente && (
        <View style={styles.floatingFooter}>
          <Button 
            title="Agendar nueva cita" 
            onPress={() => router.push('/tabs/citas/crearCita')} 
            style={styles.addBtn}
            testID="btn-agendar-nueva-cita"
            accessibilityLabel="btn-agendar-nueva-cita"
          />
        </View>
      )}

      {/* MODAL DEL COMPROBANTE MÉDICO */}
      <Modal
        visible={!!citaSeleccionada}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.voucherContainer}>
            
            <View style={styles.voucherHeader}>
              <Text style={styles.voucherMainTitle}>Detalle de la cita</Text>
              
              {/* Etiqueta de estado en la parte superior derecha del comprobante */}
              {citaSeleccionada?.estado === 'pendiente' ? (
                <View style={styles.voucherBadgeWarning}>
                  <Ionicons name="time" size={14} color="#D97706" style={{marginRight: 4}} />
                  <Text style={styles.voucherBadgeTextWarning}>PENDIENTE</Text>
                </View>
              ) : (
                <View style={styles.voucherBadgeSuccess}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary} style={{marginRight: 4}} />
                  <Text style={styles.voucherBadgeTextSuccess}>CONFIRMADA</Text>
                </View>
              )}
            </View>

            <Text style={styles.authNumber}>
              Núm. de autorización: <Text style={{fontWeight: 'bold'}}>{citaSeleccionada?.id?.substring(0, 12).toUpperCase() || 'N/A'}</Text>
            </Text>

            <View style={styles.documentBoxWrapper}>
              <View style={styles.documentTab}>
                <Text style={styles.documentTabText}>Datos de la cita médica</Text>
              </View>
              
              <View style={styles.documentBox}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Paciente:</Text>
                  <Text style={styles.dataValue}>{paciente?.nombre?.toUpperCase()}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Identificación:</Text>
                  <Text style={styles.dataValue}>ID: {paciente?.id?.substring(0, 8).toUpperCase()}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Prestador del servicio:</Text>
                  <Text style={styles.dataValue}>{citaSeleccionada?.especialista?.toUpperCase()}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Fecha y hora:</Text>
                  <Text style={styles.dataValue}>{citaSeleccionada ? obtenerFechaCompleta(citaSeleccionada.fecha_hor) : ''}</Text>
                </View>

              <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Lugar:</Text>
                  <Text style={styles.dataValue}>
                    {citaSeleccionada?.lugar 
                      ? citaSeleccionada.lugar.toUpperCase() 
                      : 'CENTRO MÉDICO EQUILIBRA - COCHABAMBA'}
                  </Text>
                </View>

                <View style={[styles.dataRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border }]}>
                  <Text style={styles.dataLabel}>Valor a pagar:</Text>
                  <Text style={styles.dataValueBold}>Cancelación en el lugar</Text>
                </View>
              </View>
            </View>

            <View style={styles.requirementsSection}>
              <Text style={styles.reqTitle}>Requisitos para cumplir las citas:</Text>
              <View style={styles.reqIconsRow}>
                <View style={styles.reqItem}>
                  <Ionicons name="id-card-outline" size={24} color={Colors.textSecondary} />
                  <Text style={styles.reqText}>Documento de{'\n'}identificación</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={Colors.borderStrong || '#CCC'} />
                <View style={styles.reqItem}>
                  <Ionicons name="document-text-outline" size={24} color={Colors.textSecondary} />
                  <Text style={styles.reqText}>Exámenes médicos{'\n'}(si aplica)</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={Colors.borderStrong || '#CCC'} />
                <View style={styles.reqItem}>
                  <Ionicons name="time-outline" size={24} color={Colors.textSecondary} />
                  <Text style={styles.reqText}>Llegar 20{'\n'}minutos antes</Text>
                </View>
              </View>
            </View>

            {/* MENSAJE Y BOTONES DE ACCIÓN SEGÚN ESTADO */}
            {citaSeleccionada?.estado === 'pendiente' && (
              <Text style={styles.exportWarning}>
                * El comprobante solo puede ser exportado una vez que la cita haya sido confirmada por el especialista.
              </Text>
            )}

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.btnSecondary} 
                onPress={() => setCitaSeleccionada(null)}
              >
                <Text style={styles.btnSecondaryText}>Cerrar</Text>
              </TouchableOpacity>
              
              {citaSeleccionada?.estado !== 'pendiente' && (
                <TouchableOpacity 
                  style={styles.btnPrimary} 
                  onPress={handleExportar}
                >
                  <Ionicons name="download-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                  <Text style={styles.btnPrimaryText}>Exportar</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
  
  fixedHeader: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    })
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, fontWeight: '500' },

  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },

  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  badgeCount: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 12 },
  badgeText: { color: Colors.primaryDark, fontWeight: '700', fontSize: 12 },

  emptyCard: { padding: 28, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 24, lineHeight: 22, fontSize: 14 },
  emptyItemCard: { backgroundColor: Colors.inputBg, alignItems: 'center', borderStyle: 'dashed', padding: 24, borderRadius: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },

  citaCard: { flexDirection: 'row', padding: 16, marginBottom: 16, alignItems: 'center' },
  dateBlock: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    marginRight: 16,
  },
  dateMonth: { color: Colors.primaryDark, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  dateDay: { color: Colors.primaryDark, fontSize: 22, fontWeight: '900' },
  citaContent: { flex: 1 },
  citaSpecialist: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  citaInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconMargin: { marginRight: 4 },
  citaTime: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

  /* ESTILOS DE ESTADO (Amarillo y Verde) */
  statusBadgeWarning: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTextWarning: { color: '#D97706', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  statusBadgeSuccess: { alignSelf: 'flex-start', backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTextSuccess: { color: Colors.primaryDark, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  citaCardPast: { opacity: 0.7, backgroundColor: Colors.background },
  dateBlockPast: { backgroundColor: Colors.border },
  dateMonthPast: { color: Colors.textSecondary, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  dateDayPast: { color: Colors.textSecondary, fontSize: 22, fontWeight: '900' },
  textPast: { color: Colors.textSecondary },
  statusBadgeCompleted: { alignSelf: 'flex-start', backgroundColor: Colors.inputBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTextCompleted: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  floatingFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 24, paddingTop: 16,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  addBtn: { borderRadius: 30, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },

  /* MODAL Y COMPROBANTE */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  voucherContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 },
      android: { elevation: 10 },
    })
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherMainTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  
  /* BADGES DEL COMPROBANTE */
  voucherBadgeWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  voucherBadgeTextWarning: { fontSize: 10, fontWeight: '800', color: '#D97706' },
  voucherBadgeSuccess: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  voucherBadgeTextSuccess: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },

  authNumber: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginBottom: 24 },
  documentBoxWrapper: { marginBottom: 24 },
  documentTab: { backgroundColor: '#333', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 6, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  documentTabText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  documentBox: { borderWidth: 1.5, borderColor: '#333', borderTopRightRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: 16 },
  dataRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  dataLabel: { width: 130, fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  dataValue: { flex: 1, fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  dataValueBold: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '800' },
  requirementsSection: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16, marginBottom: 24 },
  reqTitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  reqIconsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reqItem: { alignItems: 'center', flex: 1 },
  reqText: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
  exportWarning: { fontSize: 12, color: '#D97706', fontStyle: 'italic', marginBottom: 16, textAlign: 'center' },

  /* BOTONES DEL MODAL */
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
  },
  btnSecondaryText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  }
})
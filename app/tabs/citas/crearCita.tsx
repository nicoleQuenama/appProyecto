import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Dimensions
} from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../../context/AuthContext'
import { Colors } from '../../../constants/colors'
import { getPacienteUsuario } from '../../../services/pacienteService'
import { crearCita } from '../../../services/citaService'

import Input from '../../../components/input'
import Button from '../../../components/button'

export default function CrearCitaScreen() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  
  // Estados del formulario
  const [especialidad, setEspecialidad] = useState('')
  const [especialista, setEspecialista] = useState('')
  const [lugar, setLugar] = useState('Centro de fisioterapia')
  const [fecha, setFecha] = useState(new Date()) 
  const [hora, setHora] = useState(new Date()) 
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados UI (Pickers y Dropdowns)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Mocks para los selectores (A futuro podrías traer esto de la BD)
  const especialidades = ['Medicina General', 'Pediatría', 'Odontopediatría', 'Nutrición']
  const especialistas = ['Dra. Leszly Diaz', 'Dr. Carlos Mendoza', 'Dra. María Fernández']

  useEffect(() => {
    async function obtenerPaciente() {
      if (!user) return
      const infante = await getPacienteUsuario(user.id)
      if (infante) setPacienteId(infante.id)
    }
    obtenerPaciente()
  }, [user])

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (selectedDate) setFecha(selectedDate)
  }

  const onChangeTime = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false)
    if (selectedTime) setHora(selectedTime)
  }

  async function handleGuardar() {
    if (!especialidad || !especialista) {
      setError('Por favor completa la especialidad y el especialista.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      // Combina la fecha y la hora exactas
      const fechaHoraISO = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        hora.getHours(),
        hora.getMinutes()
      ).toISOString()
      
      const idParaGuardar = pacienteId ? pacienteId : 'demo-temporal'
      
      // Enviamos el objeto respetando tu esquema actualizado
      await crearCita({
        especialista,
        especialidad, // Nuevo campo visual
        lugar,        // Nuevo campo visual
        fecha_hor: fechaHoraISO,
        estado: 'pendiente'
      } as any, idParaGuardar) // 'as any' temporal si `crearCita` no tiene la firma actualizada aún

      Alert.alert(
        "Cita Solicitada", 
        "Tu cita ha sido agendada en estado Pendiente.",
        [{ text: "Entendido", onPress: () => router.replace('/tabs/citas') }]
      )
    } catch (e) {
      console.error(e)
      setError('Error en el guardado. Verifica tu conexión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fechaVisual = fecha.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'long' })
  const horaVisual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <KeyboardAvoidingView 
      style={styles.mainWrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* CABECERA */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.cardBg} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
        <Text style={styles.slogan}>Programa una nueva sesión</Text>
      </View>

      {/* TARJETA DE FORMULARIO BLANCA */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bottomSection}>
          
          {!pacienteId && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Estás en modo de prueba. Esta cita se guardará sin un paciente vinculado en la base de datos.
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Detalles del Profesional</Text>

          {/* DESPLEGABLE: ESPECIALIDAD */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggleDropdown('especialidad')}>
              <View pointerEvents="none">
                <Input 
                  label="Especialidad"
                  placeholder="Ej. Pediatría"
                  value={especialidad}
                  editable={false}
                  style={activeDropdown === 'especialidad' ? styles.inputDropdownActive : undefined}
                />
              </View>
              <View style={styles.dropdownIconContainer}>
                <Ionicons name={activeDropdown === 'especialidad' ? "chevron-up" : "chevron-down"} size={20} color={activeDropdown === 'especialidad' ? Colors.primary : Colors.textHint} />
              </View>
            </TouchableOpacity>

            {activeDropdown === 'especialidad' && (
              <View style={styles.dropdownList}>
                {especialidades.map((esp, index) => (
                  <TouchableOpacity 
                    key={esp} 
                    style={[styles.dropdownItem, index === especialidades.length - 1 && styles.dropdownItemLast]}
                    onPress={() => {
                      setEspecialidad(esp)
                      setActiveDropdown(null)
                    }}
                  >
                    <Text style={[styles.dropdownItemText, especialidad === esp && styles.dropdownItemTextSelected]}>{esp}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* DESPLEGABLE: ESPECIALISTA */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggleDropdown('especialista')}>
              <View pointerEvents="none">
                <Input 
                  label="Médico Especialista"
                  placeholder="Selecciona el profesional"
                  value={especialista}
                  editable={false}
                  style={activeDropdown === 'especialista' ? styles.inputDropdownActive : undefined}
                />
              </View>
              <View style={styles.dropdownIconContainer}>
                <Ionicons name={activeDropdown === 'especialista' ? "chevron-up" : "chevron-down"} size={20} color={activeDropdown === 'especialista' ? Colors.primary : Colors.textHint} />
              </View>
            </TouchableOpacity>

            {activeDropdown === 'especialista' && (
              <View style={styles.dropdownList}>
                {especialistas.map((medico, index) => (
                  <TouchableOpacity 
                    key={medico} 
                    style={[styles.dropdownItem, index === especialistas.length - 1 && styles.dropdownItemLast]}
                    onPress={() => {
                      setEspecialista(medico)
                      setActiveDropdown(null)
                    }}
                  >
                    <Text style={[styles.dropdownItemText, especialista === medico && styles.dropdownItemTextSelected]}>{medico}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Fecha y Hora</Text>

          {/* FECHA Y HORA (En una fila) */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <Input 
                    label="Fecha"
                    placeholder="Seleccionar"
                    value={fechaVisual}
                    editable={false} 
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.halfWidth}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowTimePicker(true)}>
                <View pointerEvents="none">
                  <Input 
                    label="Hora"
                    placeholder="Seleccionar"
                    value={horaVisual}
                    editable={false} 
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              minimumDate={new Date()} 
              onChange={onChangeDate}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={hora}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Ubicación</Text>
          <Input 
            label="Lugar de la consulta"
            value={lugar}
            onChangeText={setLugar}
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button 
            title="Solicitar Cita"
            onPress={handleGuardar}
            isLoading={isSubmitting}
            style={styles.submitBtn}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Colors.primary, 
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    zIndex: 10,
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 28, 
    fontWeight: '900',
    color: Colors.cardBg, 
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 40, 
  },
  slogan: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryLight, 
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.cardBg, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48, 
    minHeight: Dimensions.get('window').height * 0.7,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 12 }, 
    })
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  warningBox: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginBottom: 24 },
  warningText: { color: '#D97706', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  errorBox: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 12, marginTop: 16 },
  errorText: { color: Colors.danger, textAlign: 'center', fontSize: 13, fontWeight: '500' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },

  dropdownWrapper: { position: 'relative', zIndex: 1, marginBottom: 16 },
  inputDropdownActive: { borderColor: Colors.primaryMid, backgroundColor: Colors.primaryLight },
  dropdownIconContainer: { position: 'absolute', right: 16, bottom: 28, justifyContent: 'center', alignItems: 'center' },
  dropdownList: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.borderStrong, borderRadius: 12, marginTop: -10, marginBottom: 8, overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } })
  },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dropdownItemLast: { borderBottomWidth: 0 },
  dropdownItemText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  dropdownItemTextSelected: { color: Colors.primaryDark, fontWeight: '700' },
  
  submitBtn: {
    marginTop: 24, paddingVertical: 16, borderRadius: 30,
    shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  }
})
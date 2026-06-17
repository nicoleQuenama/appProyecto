import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../context/AuthContext'
import { Colors } from '../../constants/colors'
import { vincularPaciente } from '../../services/pacienteService'

import Input from '../../components/input'
import Button from '../../components/button'

export default function VincularPacienteScreen() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [form, setForm] = useState({
    codigoVinculacion: '', // <-- Corregido: Código único del sistema
    nombre: '',
    genero: '',
    fechaNacimiento: new Date()
  })

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generos = ['Masculino', 'Femenino']

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (selectedDate) setForm({ ...form, fechaNacimiento: selectedDate })
  }

  const handleVincular = async () => {
    if (!form.codigoVinculacion || !form.nombre || !form.genero) {
      Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios para continuar.")
      return
    }

    try {
      setIsSubmitting(true)

      await vincularPaciente(
        {
          nombre: form.nombre,
          nacimiento: form.fechaNacimiento.toISOString().split('T')[0],
          codigo: form.codigoVinculacion,
          genero: form.genero,
        },
        user?.id ?? ''
      )

      Alert.alert(
        "¡Expediente Vinculado!", 
        `El perfil de ${form.nombre} ha sido enlazado a tu cuenta exitosamente.`,
        [{ text: "Continuar", onPress: () => router.back() }]
      )

    } catch (error) {
      console.error(error)
      Alert.alert("Error", "No se pudo vincular el expediente. Verifica que el código sea correcto.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fechaVisual = form.fechaNacimiento.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

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
        <Text style={styles.headerTitle}>Vincular Paciente</Text>
        <Text style={styles.slogan}>Conecta el expediente </Text>
      </View>

      {/* FORMULARIO */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bottomSection}>
          
          <View style={styles.infoBox}>
            <Ionicons name="key" size={24} color={Colors.primary} style={{marginRight: 12}} />
            <Text style={styles.infoText}>
              Ingresa el <Text style={{fontWeight: '800'}}>código de vinculación</Text> proporcionado por tu médico o centro de salud para enlazar el expediente.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Datos de Verificación</Text>

          <Input 
            label="Código de Vinculación"
            placeholder="Ej. EQ-9823-XYZ"
            value={form.codigoVinculacion}
            onChangeText={(v) => setForm({...form, codigoVinculacion: v})}
            autoCapitalize="characters"
            testID="input-codigo-vinculacion"
            accessibilityLabel="input-codigo-vinculacion"
          />

          <Input 
            label="Nombre del Paciente"
            placeholder="Ej. Ana Sofía Machado"
            value={form.nombre}
            onChangeText={(v) => setForm({...form, nombre: v})}
            autoCapitalize="words"
            testID="input-nombre-paciente"
            accessibilityLabel="input-nombre-paciente"
          />

          {/* DESPLEGABLE: GÉNERO */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggleDropdown('genero')} testID="input-genero-paciente" accessibilityLabel="input-genero-paciente">
              <View pointerEvents="none">
                <Input 
                  label="Género"
                  placeholder="Seleccionar"
                  value={form.genero}
                  editable={false}
                  style={activeDropdown === 'genero' ? styles.inputDropdownActive : undefined}
                />
              </View>
              <View style={styles.dropdownIconContainer}>
                <Ionicons name={activeDropdown === 'genero' ? "chevron-up" : "chevron-down"} size={20} color={activeDropdown === 'genero' ? Colors.primary : Colors.textHint} />
              </View>
            </TouchableOpacity>

            {activeDropdown === 'genero' && (
              <View style={styles.dropdownList}>
                {generos.map((gen, index) => (
                  <TouchableOpacity 
                    key={gen} 
                    style={[styles.dropdownItem, index === generos.length - 1 && styles.dropdownItemLast]}
                    onPress={() => {
                      setForm({...form, genero: gen})
                      setActiveDropdown(null)
                    }}
                    accessibilityLabel={`opt-genero-${gen}`}
                  >
                    <Text style={[styles.dropdownItemText, form.genero === gen && styles.dropdownItemTextSelected]}>{gen}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* SELECTOR DE FECHA DE NACIMIENTO */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)} style={{marginTop: 4}} testID="input-fecha-paciente" accessibilityLabel="input-fecha-paciente">
            <View pointerEvents="none">
              <Input 
                label="Fecha de Nacimiento"
                placeholder="Seleccionar"
                value={fechaVisual}
                editable={false} 
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.fechaNacimiento}
              mode="date"
              display="default"
              maximumDate={new Date()} 
              onChange={onChangeDate}
            />
          )}

          <Button 
            title="Vincular Expediente"
            onPress={handleVincular}
            isLoading={isSubmitting}
            style={styles.submitBtn}
            testID="btn-vincular-expediente"
            accessibilityLabel="btn-vincular-expediente"
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: Colors.primary },
  scrollContent: { flexGrow: 1 },
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40, paddingHorizontal: 24,
    backgroundColor: Colors.primary, position: 'relative',
  },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 24, zIndex: 10, padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.cardBg, letterSpacing: 0.5, marginBottom: 4, marginTop: 40 },
  slogan: { fontSize: 16, fontWeight: '500', color: Colors.primaryLight },
  
  bottomSection: {
    flex: 1, backgroundColor: Colors.cardBg, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48, minHeight: Dimensions.get('window').height * 0.75,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 }, android: { elevation: 12 } })
  },
  
  infoBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight,
    padding: 16, borderRadius: 12, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.primaryDark, lineHeight: 20, fontWeight: '500' },
  
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* DESPLEGABLE */
  dropdownWrapper: { position: 'relative', zIndex: 1, marginBottom: 4 },
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
    marginTop: 32, paddingVertical: 16, borderRadius: 30,
    shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  }
})
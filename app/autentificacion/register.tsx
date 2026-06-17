import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Dimensions
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { registrarUsuario, traducirError } from '../../services/authService' 
import { Colors } from '../../constants/colors'
import Input from '../../components/input'
import Button from '../../components/button'

const { height } = Dimensions.get('window')

export default function RegisterScreen() {
  const router = useRouter()
  
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneCode: '+591', 
    phoneNumber: '',
    fecha_nacimiento: new Date(), 
    gender: '',
    relation_pacien: '',
    address: ''
  })
  
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [dateFormatted, setDateFormatted] = useState('') 

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const genderOptions = ['Masculino', 'Femenino', 'Otro']

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    
    if (selectedDate) {
      setForm({ ...form, fecha_nacimiento: selectedDate })
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      setDateFormatted(`${year}-${month}-${day}`)
    }
  }

  async function handleRegister() {
    setErrors({})
    let hasError = false
    const newErrors: Record<string, string> = {}

    if (!form.fullName.trim()) { newErrors.fullName = 'Campo obligatorio'; hasError = true; }
    if (!form.username.trim()) { newErrors.username = 'Campo obligatorio'; hasError = true; }
    if (!form.email.trim()) { newErrors.email = 'Campo obligatorio'; hasError = true; }
    if (!form.password) { newErrors.password = 'Campo obligatorio'; hasError = true; }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    try {
      setIsSubmitting(true)
      
      const combinedPhone = form.phoneNumber.trim() 
        ? `${form.phoneCode} ${form.phoneNumber.trim()}` 
        : ''

      await registrarUsuario({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        phone: combinedPhone,
        fecha_nacimiento: form.fecha_nacimiento,
        gender: form.gender,
        relation_pacien: form.relation_pacien,
        address: form.address
      } as any);
      
      Alert.alert(
        "Registro exitoso", 
        "Tu cuenta ha sido creada correctamente.",
        [{ text: "Continuar", onPress: () => router.replace('/autentificacion/login') }]
      )
      
    } catch (error: any) {
      console.error("Error en registro:", error)
      Alert.alert("Error de registro", traducirError(error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.mainWrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled" 
      >
        <View style={styles.topSection}>
          <Text style={styles.brandLogo}>EQUILIBRA</Text>
          <Text style={styles.slogan}>Únete a nuestra plataforma</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.welcomeTitle}>Crear una cuenta</Text>
          
          <View style={styles.formContainer}>
            
            <Text style={styles.sectionTitle}>Datos personales</Text>
            
            <Input 
              label="Nombre Completo"
              placeholder="Ej. Juan Pérez"
              value={form.fullName}
              onChangeText={(v) => setForm({...form, fullName: v})}
              error={errors.fullName}
              editable={!isSubmitting}
              testID="input-fullName"
              accessibilityLabel="input-fullName"
            />

            <Input 
              label="Nombre de Usuario"
              placeholder="Ej. juanperez123"
              autoCapitalize="none"
              autoCorrect={false}
              value={form.username}
              onChangeText={(v) => setForm({...form, username: v})}
              error={errors.username}
              editable={!isSubmitting}
              testID="input-username"
              accessibilityLabel="input-username"
            />

            <Input 
              label="Correo Electrónico "
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={form.email}
              onChangeText={(v) => setForm({...form, email: v})}
              error={errors.email}
              editable={!isSubmitting}
              testID="input-email"
              accessibilityLabel="input-email"
            />

            <Input 
              label="Contraseña "
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => setForm({...form, password: v})}
              error={errors.password}
              editable={!isSubmitting}
              testID="input-password"
              accessibilityLabel="input-password"
            />
            
            <View style={styles.phoneRow}>
              <View style={styles.phoneCodeContainer}>
                <Input 
                  label="Cód."
                  placeholder="+591"
                  value={form.phoneCode}
                  onChangeText={(v) => setForm({...form, phoneCode: v})}
                  editable={!isSubmitting}
                  keyboardType="phone-pad"
                  testID="input-phoneCode"
                  accessibilityLabel="input-phoneCode"
                />
              </View>
              <View style={styles.phoneNumberContainer}>
                <Input 
                  label="Teléfono"
                  placeholder="Ej. 70000000"
                  keyboardType="phone-pad"
                  value={form.phoneNumber}
                  onChangeText={(v) => setForm({...form, phoneNumber: v})}
                  editable={!isSubmitting}
                  testID="input-phoneNumber"
                  accessibilityLabel="input-phoneNumber"
                />
              </View>
            </View>

            <View pointerEvents="box-only">
              <TouchableOpacity activeOpacity={0.7} onPress={() => !isSubmitting && setShowDatePicker(true)} testID="input-fechaNacimiento" accessibilityLabel="input-fechaNacimiento">
                <Input 
                  label="Fecha de Nacimiento"
                  placeholder="Selecciona una fecha"
                  value={dateFormatted}
                  editable={false} 
                />
              </TouchableOpacity>
            </View>
            
            {showDatePicker && (
              <DateTimePicker
                value={form.fecha_nacimiento}
                mode="date"
                display="default"
                maximumDate={new Date()} 
                onChange={onChangeDate}
              />
            )}

            {/* DESPLEGABLE REFINADO PARA GÉNERO */}
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => !isSubmitting && setShowGenderDropdown(!showGenderDropdown)}
                testID="input-gender"
                accessibilityLabel="input-gender"
              >
                <View pointerEvents="none">
                  <Input 
                    label="Género"
                    placeholder="Selecciona tu género"
                    value={form.gender}
                    editable={false}
                    style={showGenderDropdown ? styles.inputDropdownActive : undefined}
                  />
                </View>
                <View style={styles.dropdownIconContainer}>
                  <Text style={[styles.dropdownIcon, showGenderDropdown && styles.dropdownIconActive]}>
                    {showGenderDropdown ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {showGenderDropdown && (
                <View style={styles.dropdownList}>
                  {genderOptions.map((option, index) => {
                    const isSelected = form.gender === option;
                    return (
                      <TouchableOpacity 
                        key={option} 
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === genderOptions.length - 1 && styles.dropdownItemLast 
                        ]}
                        activeOpacity={0.6}
                        onPress={() => {
                          setForm({...form, gender: option});
                          setShowGenderDropdown(false);
                        }}
                        accessibilityLabel={`opt-gender-${option}`}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected
                        ]}>
                          {option}
                        </Text>
                        {isSelected && (
                          <Text style={styles.dropdownCheckmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>

            <Input 
              label="Relación con el paciente"
              placeholder="Ej. Padre, Madre, Abuelo/a"
              value={form.relation_pacien}
              onChangeText={(v) => setForm({...form, relation_pacien: v})}
              editable={!isSubmitting}
              testID="input-relation"
              accessibilityLabel="input-relation"
            />

            <Input 
              label="Dirección"
              placeholder="Ej. Calle Falsa 123"
              value={form.address}
              onChangeText={(v) => setForm({...form, address: v})}
              editable={!isSubmitting}
              testID="input-address"
              accessibilityLabel="input-address"
            />

            <Button 
              title="Completar registro"
              onPress={handleRegister}
              isLoading={isSubmitting}
              style={styles.registerBtn}
              testID="btn-register"
              accessibilityLabel="btn-register"
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/autentificacion/login')}>
              <Text style={styles.loginText}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
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
    height: height * 0.25, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, 
  },
  brandLogo: {
    fontSize: 28, 
    fontWeight: '900',
    color: Colors.cardBg, 
    letterSpacing: 2,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryLight, 
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.cardBg, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48, 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 12 }, 
    })
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary, 
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneCodeContainer: {
    flex: 0.28, 
  },
  phoneNumberContainer: {
    flex: 0.68,
  },

  /* ESTILOS DEL DESPLEGABLE REFINADO */
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1, 
    marginBottom: 16,
  },
  inputDropdownActive: {
    borderColor: Colors.primaryMid,
    backgroundColor: Colors.primaryLight,
  },
  dropdownIconContainer: {
    position: 'absolute',
    right: 16,
    bottom: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    color: Colors.textHint,
    fontSize: 12,
  },
  dropdownIconActive: {
    color: Colors.primary,
  },
  dropdownList: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderStrong, // Borde más definido
    borderRadius: 12,
    marginTop: -10, // Se une más orgánicamente al input
    marginBottom: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    })
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.background, // Fondo sutil para el seleccionado
  },
  dropdownItemLast: {
    borderBottomWidth: 0, 
  },
  dropdownItemText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  dropdownCheckmark: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerBtn: {
    backgroundColor: Colors.primary, 
    paddingVertical: 16,
    borderRadius: 30, 
    marginTop: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginRight: 6,
    fontWeight: '500',
  },
  loginText: {
    color: Colors.primaryDark, 
    fontWeight: '800',
    fontSize: 15,
  }
})
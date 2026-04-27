import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useAuthActions } from '../../hooks/useAuth'
import { RegisterForm } from '../../schemas/auth.types'
import { Colors } from '../../constants/colors'

export default function RegisterScreen() {
  const { handleRegister, loading, error } = useAuthActions()
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  
  // Estado inicial con los nuevos campos de tu esquema
  const [form, setForm] = useState<RegisterForm>({
    id: '', 
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: 'otro',
    relation_pacien: '', // Nuevo campo
    fecha_nacimiento: new Date(),
    address: '' // Nuevo campo
  })

  const update = (field: keyof RegisterForm, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const inputStyle = (name: string) => [
    styles.input,
    focusedInput === name && styles.inputFocused,
  ]

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>Crear cuenta</Text>
          <Text style={styles.appTagline}>Únete a Equilibra para cuidar de tu paciente</Text>
        </View>

        {/* Sección 1: Datos de Acceso */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos de Acceso</Text>
          
          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput
            style={inputStyle('fullName')}
            placeholder="Ej. María García"
            value={form.fullName}
            onChangeText={(v) => update('fullName', v)}
            onFocus={() => setFocusedInput('fullName')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Nombre de Usuario *</Text>
          <TextInput
            style={inputStyle('username')}
            placeholder="mariag24"
            autoCapitalize="none"
            value={form.username}
            onChangeText={(v) => update('username', v)}
            onFocus={() => setFocusedInput('username')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Correo Electrónico *</Text>
          <TextInput
            style={inputStyle('email')}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={inputStyle('password')}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => update('password', v)}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Sección 2: Vínculo y Ubicación (Nuevos Campos) */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Vínculo y Ubicación</Text>

          <Text style={styles.label}>Relación con el Paciente *</Text>
          <TextInput
            style={inputStyle('relation_pacien')}
            placeholder="Ej. Madre, Padre, Tutor legal"
            value={String(form.relation_pacien)}
            onChangeText={(v) => update('relation_pacien', v)}
            onFocus={() => setFocusedInput('relation_pacien')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Dirección de Residencia *</Text>
          <TextInput
            style={[inputStyle('address'), { height: 80 }]}
            placeholder="Calle, Número, Ciudad"
            multiline
            numberOfLines={3}
            value={form.address}
            onChangeText={(v) => update('address', v)}
            onFocus={() => setFocusedInput('address')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Teléfono de contacto</Text>
          <TextInput
            style={inputStyle('phone')}
            placeholder="70000000"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            onFocus={() => setFocusedInput('phone')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={() => handleRegister(form)}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Registrarse</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>¿Ya tienes cuenta? </Text>
          <Link href="/autentificacion/login">
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 28, fontWeight: '800', color: Colors.primaryDark },
  appTagline: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 10, textTransform: 'uppercase' },
  label: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: Colors.inputBg, borderRadius: 12, padding: 12, fontSize: 15, borderWidth: 1, borderColor: Colors.border },
  inputFocused: { borderColor: Colors.primary, backgroundColor: '#F0F7FF' },
  btnPrimary: { backgroundColor: Colors.primary, borderRadius: 15, padding: 16, alignItems: 'center', marginTop: 24 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorBox: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 12, marginTop: 16 },
  errorText: { color: Colors.danger, textAlign: 'center', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 40 },
  footerLink: { color: Colors.primary, fontWeight: 'bold' }
})
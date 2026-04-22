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

const GENDER_OPTIONS: { label: string; value: RegisterForm['gender'] }[] = [
  { label: 'Masculino', value: 'masculino' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Otro', value: 'otro' },
]

export default function RegisterScreen() {
  const { handleRegister, loading, error } = useAuthActions()
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    gender: undefined,
  })

  const update = (field: keyof RegisterForm, value: string) =>
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoInner}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
          </View>
          <Text style={styles.appName}>Crear cuenta</Text>
          <Text style={styles.appTagline}>Completa tu información para comenzar</Text>
        </View>

        {/* Sección: datos obligatorios */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionLabel}>Datos de acceso</Text>
          </View>

          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={inputStyle('fullName')}
            placeholder="Juan Pérez"
            placeholderTextColor={Colors.textHint}
            value={form.fullName}
            onFocus={() => setFocusedInput('fullName')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('fullName', v)}
          />

          <Text style={styles.label}>Nombre de usuario *</Text>
          <View style={styles.usernameWrapper}>
            <Text style={styles.usernameAt}>@</Text>
            <TextInput
              style={[inputStyle('username'), styles.usernameInput]}
              placeholder="juanperez"
              placeholderTextColor={Colors.textHint}
              autoCapitalize="none"
              value={form.username}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(v) => update('username', v)}
            />
          </View>

          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput
            style={inputStyle('email')}
            placeholder="juan@ejemplo.com"
            placeholderTextColor={Colors.textHint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('email', v)}
          />

          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={inputStyle('password')}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.textHint}
            secureTextEntry
            value={form.password}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('password', v)}
          />
        </View>

        {/* Sección: datos opcionales */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.secondary }]} />
            <Text style={[styles.sectionLabel, { color: Colors.secondary }]}>
              Información adicional
            </Text>
            <Text style={styles.optionalTag}>opcional</Text>
          </View>

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={inputStyle('phone')}
            placeholder="+591 70000000"
            placeholderTextColor={Colors.textHint}
            keyboardType="phone-pad"
            value={form.phone}
            onFocus={() => setFocusedInput('phone')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('phone', v)}
          />

          <Text style={styles.label}>Fecha de nacimiento *</Text>
          <TextInput
            style={inputStyle('birthDate')}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textHint}
            value={form.birthDate}
            onFocus={() => setFocusedInput('birthDate')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('birthDate', v)}
          />

          <Text style={styles.label}>Género</Text>
          <View style={styles.genderGrid}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.genderBtn,
                  form.gender === opt.value && styles.genderBtnActive,
                ]}
                onPress={() => setForm((prev) => ({ ...prev, gender: opt.value }))}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.genderText,
                  form.gender === opt.value && styles.genderTextActive,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Botón registrar */}
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={() => handleRegister(form)}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Crear cuenta</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <Link href="/autentificacion/login">
            <Text style={styles.footerLink}>Iniciar sesión</Text>
          </Link>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionalTag: {
    fontSize: 11,
    color: Colors.textHint,
    marginLeft: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.primaryBorder,
    backgroundColor: Colors.primaryLight,
  },
  usernameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingLeft: 14,
  },
  usernameAt: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  genderBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  genderBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondary,
  },
})
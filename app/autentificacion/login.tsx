import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useAuthActions } from '../../hooks/useAuth'
import { Colors } from '../../constants/colors'

export default function LoginScreen() {
  const { handleLogin, loading, error } = useAuthActions()
  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const update = (field: string, value: string) =>
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
        {/* Cabecera con logo y título */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoInner}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
          </View>
          <Text style={styles.appName}>Equilibra</Text>
          <Text style={styles.appTagline}>Seguimiento de movilidad para tu paciente</Text>
        </View>

        {/* Card del formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <Text style={styles.cardSubtitle}>Ingresa con tu correo o nombre de usuario</Text>

          <Text style={styles.label}>Correo o usuario</Text>
          <TextInput
            style={inputStyle('emailOrUsername')}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor={Colors.textHint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.emailOrUsername}
            onFocus={() => setFocusedInput('emailOrUsername')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('emailOrUsername', v)}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={inputStyle('password')}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={Colors.textHint}
            secureTextEntry
            value={form.password}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(v) => update('password', v)}
          />

          {/* Mensaje de error traducido */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={() => handleLogin(form)}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Iniciar sesión</Text>
            }
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <Link href="/autentificacion/register">
              <Text style={styles.footerLink}>Crear cuenta</Text>
            </Link>
          </View>
        </View>

        {/* Nota de seguridad al pie */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            Tus datos están protegidos con cifrado de extremo a extremo
          </Text>
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
    paddingTop: 60,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
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
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
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
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  separatorText: {
    fontSize: 13,
    color: Colors.textHint,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  securityNote: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  securityText: {
    fontSize: 11,
    color: Colors.textHint,
    textAlign: 'center',
    lineHeight: 16,
  },
})
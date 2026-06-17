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
import { useAuth } from '../../context/AuthContext'
import { loginUser, traducirError } from '../../services/authService' 
import { Colors } from '../../constants/colors'
import Input from '../../components/input'
import Button from '../../components/button'

const { height } = Dimensions.get('window')

export default function LoginScreen() {
  const router = useRouter()
  const { setLocalSession } = useAuth() 
  
  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  const [errors, setErrors] = useState({ emailOrUsername: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogin() {
    setErrors({ emailOrUsername: '', password: '' })
    let hasError = false

    if (!form.emailOrUsername.trim()) {
      setErrors(prev => ({ ...prev, emailOrUsername: 'Campo obligatorio' }))
      hasError = true
    }
    
    if (!form.password) {
      setErrors(prev => ({ ...prev, password: 'Campo obligatorio' }))
      hasError = true
    }

    if (hasError) return

    try {
      setIsSubmitting(true)
      
      const userData = await loginUser({
        emailOrUsername: form.emailOrUsername.trim(),
        password: form.password
      })
      
      if (userData) {
        setLocalSession(userData)
      }
      
      router.replace('/tabs/home')

    } catch (error: any) {
      console.error("Error en login:", error)
      Alert.alert("Error de acceso", traducirError(error.message))
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
      >
        <View style={styles.topSection}>
          <Text style={styles.brandLogo}>EQUILIBRA</Text>
          <Text style={styles.slogan}>Gestión médica{'\n'}simplificada</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.welcomeTitle}>¡Bienvenido de nuevo!</Text>
          
          <View style={styles.formContainer}>
            <Input 
              label="Correo Electrónico o Usuario"
              placeholder="Ingresa tu usuario o correo"
              autoCapitalize="none"
              autoCorrect={false}
              value={form.emailOrUsername}
              onChangeText={(v) => setForm({...form, emailOrUsername: v})}
              error={errors.emailOrUsername}
              editable={!isSubmitting}
              testID="input-email" //
              accessibilityLabel={"input-email"}
            />

            <Input 
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => setForm({...form, password: v})}
              error={errors.password}
              editable={!isSubmitting}
              testID="input-password"
              accessibilityLabel={"input-password"}
            />

            <TouchableOpacity style={styles.forgotPasswordBtn}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Button 
              title="Iniciar sesión"
              onPress={handleLogin}
              isLoading={isSubmitting}
              style={styles.loginBtn}
              testID="btn-login"
              accessibilityLabel= "btn-login"
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/autentificacion/register')} testID="link-register" accessibilityLabel="link-register">
              <Text style={styles.registerText}>Regístrate aquí</Text>
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
    height: height * 0.35, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
  },
  brandLogo: {
    fontSize: 36, 
    fontWeight: '900',
    color: Colors.cardBg, 
    letterSpacing: 2,
    marginBottom: 12,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryLight, 
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.cardBg, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48, // Aumentado para dar espacio general en la parte inferior
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 12 }, 
    })
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary, 
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: Colors.primary, 
    fontWeight: '700',
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: Colors.primary, 
    paddingVertical: 16,
    borderRadius: 30, 
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 24, // Agregado margen de seguridad específico para evitar la barra de navegación
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginRight: 6,
    fontWeight: '500',
  },
  registerText: {
    color: Colors.primaryDark, 
    fontWeight: '800',
    fontSize: 15,
  }
})
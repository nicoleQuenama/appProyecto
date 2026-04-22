import {supabase} from '../lib/supabase'
import { RegisterForm, LoginForm } from '../schemas/auth.types'

// Creación de usuario 
export async function registrarUsuario(form: RegisterForm) {
    await supabase.auth.signOut()
    const payload = {
    full_name: form.fullName,
    username: form.username,
    phone: form.phone ?? null,
    birth_date: form.birthDate ?? null,
    gender: form.gender ?? null,
  }
  
  console.log('PAYLOAD COMPLETO:', JSON.stringify(payload))

  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: payload },
  })

  console.log('RESPUESTA SUPABASE:', JSON.stringify({ data, error }))
  if (error) throw error
  return data
}

// Logueo — verifica si es email o username
export async function loginUser(form: LoginForm) {
  const isEmail = form.emailOrUsername.includes('@')
  if (isEmail) {
    return loginWithEmail(form.emailOrUsername, form.password)
  } else {
    return loginWithUsername(form.emailOrUsername, form.password)
  }
}

// Login con email
async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Login con username
async function loginWithUsername(username: string, password: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single()

  if (error || !profile) throw new Error('Usuario no encontrado')
  return loginWithEmail(profile.email, password)
}

// Cerrar sesión
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

function traducirError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos'
  if (message.includes('User already registered')) return 'Este correo ya está registrado'
  if (message.includes('Usuario no encontrado')) return 'Nombre de usuario no encontrado'
  if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres'
  return 'Ocurrió un error, intenta de nuevo'
}

export { traducirError }
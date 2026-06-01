import { supabase } from '../lib/supabase'
import { db } from '../lib/database'
import { RegisterForm, LoginForm } from '../schemas/auth.types'

// reconoce que bd estamos usando
const USAR_SQLITE = true;

// Variable temporal para recordar la sesión en SQLite
export let currentUserId: string | null = null;

// ==========================================
// Supabase
// ==========================================
async function registrarUsuario_Supabase(form: RegisterForm) {
  await supabase.auth.signOut()
  const emailLimpio = form.email.trim().toLowerCase()

  const payload = {
    nombre_completo: form.fullName,
    username: form.username,
    email: emailLimpio,
    password: form.password,
    telefono: form.phone,
    nacimiento: form.fecha_nacimiento,
    genero: form.gender,
    relacion_pacien: form.relation_pacien,
    direccion: form.address,
  }
  
  const { data, error } = await supabase.auth.signUp({
    email: emailLimpio,
    password: form.password,
    options: { data: payload },
  })

  if (error) throw error
  return data
}

async function loginUser_Supabase(form: LoginForm) {
  const isEmail = form.emailOrUsername.includes('@')
  if (isEmail) {
    return loginWithEmail_Supabase(form.emailOrUsername, form.password)
  } else {
    return loginWithUsername_Supabase(form.emailOrUsername, form.password)
  }
}

async function loginWithEmail_Supabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function loginWithUsername_Supabase(username: string, password: string) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('email')
    .eq('username', username)
    .single()

  if (error || !usuario) throw new Error('Usuario no encontrado')
  return loginWithEmail_Supabase(usuario.email, password)
}

async function logoutUser_Supabase() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ==========================================
// sqlite
// ==========================================
async function registrarUsuario_SQLite(form: RegisterForm) {
  const emailLimpio = form.email.trim().toLowerCase()
  const newId = form.id || Math.random().toString(36).substring(2, 15)

  try {
    await db.runAsync(
      `INSERT INTO usuarios (id, fullname, username, email, password, phone, fecha_nacimiento, gender, relation_pacien, address, token_not)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, form.fullName, form.username, emailLimpio, form.password,
        form.phone || '', form.fecha_nacimiento.toISOString(), form.gender || 'otro',
        form.relation_pacien, form.address, form.token_not || ''
      ]
    );

    const newUser = { id: newId, email: emailLimpio, username: form.username };
    currentUserId = newId; 
    return newUser;
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) throw new Error('User already registered');
    throw error;
  }
}

async function loginUser_SQLite(form: LoginForm) {
  const isEmail = form.emailOrUsername.includes('@')
  const loginLimpio = form.emailOrUsername.trim().toLowerCase()

  let query = isEmail
    ? 'SELECT * FROM usuarios WHERE email = ? AND password = ?'
    : 'SELECT * FROM usuarios WHERE username = ? AND password = ?';

  const user: any = await db.getFirstAsync(query, [loginLimpio, form.password]);

  if (!user) throw new Error('Invalid login credentials');
  
  currentUserId = user.id; 
  return user;
}

async function logoutUser_SQLite() {
  currentUserId = null;
  return true;
}

// ==========================================
// 3. EXPORTACIONES
// ==========================================
export const registrarUsuario = USAR_SQLITE ? registrarUsuario_SQLite : registrarUsuario_Supabase;
export const loginUser = USAR_SQLITE ? loginUser_SQLite : loginUser_Supabase;
export const logoutUser = USAR_SQLITE ? logoutUser_SQLite : logoutUser_Supabase;

export function traducirError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos'
  if (message.includes('User already registered')) return 'Este correo o usuario ya está registrado'
  if (message.includes('Usuario no encontrado')) return 'Nombre de usuario no encontrado'
  if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres'
  if (message.includes('rate limit')) return 'Demasiados intentos. Por favor, espera un momento y vuelve a intentar.'
  return 'Ocurrió un error, intenta de nuevo'
}
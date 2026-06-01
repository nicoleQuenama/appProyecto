import { supabase } from '../lib/supabase'
import { db } from '../lib/database'
import { Usuario } from '../schemas/user.types'
import { currentUserId } from './authService' 

// sqlite
const USAR_SQLITE = true;

// ==========================================
//supabase
// ==========================================
async function getUsuario_Supabase(retries = 3): Promise<Usuario> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay una sesión de usuario activa')

  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, fullname, username, email, phone, gender, relation_pacien, fecha_nacimiento, address, token_not')
      .eq('id', user.id) 
      .maybeSingle() 

    if (error) throw error
    if (data) return data as Usuario
 
    if (i < retries - 1) {
      console.log(`Usuario no encontrado, reintento ${i + 1} de ${retries}...`)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  throw new Error('No se pudo cargar el perfil del usuario. Por favor, intenta iniciar sesión de nuevo.')
}

// ==========================================
// SQLITE
// ==========================================
async function getUsuario_SQLite(retries = 3): Promise<Usuario> {
  if (!currentUserId) throw new Error('No hay una sesión de usuario activa')

  try {
    const user: any = await db.getFirstAsync(
      'SELECT id, fullname, username, email, phone, gender, relation_pacien, fecha_nacimiento, address, token_not FROM usuarios WHERE id = ?',
      [currentUserId]
    );

    if (!user) throw new Error('Usuario no encontrado en la base de datos');
    return user as Usuario;
  } catch (error) {
    throw new Error('No se pudo cargar el perfil del usuario. Por favor, intenta iniciar sesión de nuevo.')
  }
}

// ==========================================
// 3. EXPORTACIÓN DINÁMICA
// ==========================================
export const getUsuario = USAR_SQLITE ? getUsuario_SQLite : getUsuario_Supabase;
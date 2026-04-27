import { supabase } from '../lib/supabase'
import { Usuario } from '../schemas/user.types'

export async function getUsuario(retries = 3): Promise<Usuario> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('No hay una sesión de usuario activa')
  }


  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, full_name, username, email, phone, password, gender,relation_pacien, fecha_nacimiento, address')
      .eq('id', user.id) 
      .maybeSingle() 

    if (error) throw error
    //if (data) return data
 
    if (i < retries - 1) {
      console.log(`Usuario no encontrado, reintento ${i + 1} de ${retries}...`)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  throw new Error('No se pudo cargar el perfil del usuario. Por favor, intenta iniciar sesión de nuevo.')
}
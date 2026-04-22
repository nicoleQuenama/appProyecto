import { supabase } from '../lib/supabase'
import { Profile } from '../schemas/profile.types'

export async function getProfile(retries = 3): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('No hay una sesión de usuario activa')
  }


  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, email, phone, birth_date, gender, created_at')
      .eq('id', user.id) 
      .maybeSingle() 

    if (error) throw error

    if (data) return data

    if (i < retries - 1) {
      console.log(`Perfil no encontrado, reintento ${i + 1} de ${retries}...`)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  throw new Error('No se pudo cargar el perfil del usuario. Por favor, intenta iniciar sesión de nuevo.')
}
import { useEffect, useState } from 'react'
import { getUsuario} from '../services/usuarioService'
import { Usuario } from '../schemas/user.types'

//carga el perfil
export function useProfile() {
  const [profile, setProfile] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUsuario()
      .then(setProfile)
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading, error }
}
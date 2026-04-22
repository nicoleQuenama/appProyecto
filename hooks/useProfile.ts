import { useEffect, useState } from 'react'
import { getProfile} from '../services/profileService'
import { Profile } from '../schemas/profile.types'

//carga el perfil
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading, error }
}
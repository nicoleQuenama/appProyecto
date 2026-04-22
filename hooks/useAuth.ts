import { useState } from 'react'
import {useRouter} from 'expo-router'
import {loginUser, registrarUsuario, logoutUser} from '../services/authService'
import {LoginForm, RegisterForm} from '../schemas/auth.types'

//conexion con pnatallas
export function useAuthActions(){
    const router= useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError]= useState<string | null>(null)

    async function handleLogin(form:LoginForm) {
        try{
            setLoading(true)
            setError(null)
            await loginUser(form)
            router.replace('/tabs/home')
        }
        catch(e:any){
            setError(traducirError(e.message))
        }
        finally{
            setLoading(false)
        }
    }

    async function handleRegister(form:RegisterForm) {
        try{
            setLoading(true)
            setError(null)
            await registrarUsuario(form)
            router.replace('/autentificacion/login')
        }
        catch(e:any){
            setError(traducirError(e.message))
        }
        finally{
            setLoading(false)
        } 
    }
    async function handleLogout() {
        await logoutUser()
        router.replace('/autentificacion/login') 
    }
    return {handleLogin, handleRegister, handleLogout,loading, error}
}

function traducirError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos'
  if (message.includes('User already registered')) return 'Este correo ya está registrado'
  if (message.includes('Usuario no encontrado')) return 'Nombre de usuario no encontrado'
  if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres'
  return 'Ocurrió un error, intenta de nuevo'
}
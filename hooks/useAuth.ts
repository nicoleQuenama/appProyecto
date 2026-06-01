import { useState } from 'react'
import { useRouter } from 'expo-router'
import { loginUser, registrarUsuario, logoutUser } from '../services/authService'
import { LoginForm, RegisterForm } from '../schemas/auth.types'
import { useAuth } from '../context/AuthContext'

export function useAuthActions(){
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // Traemos nuestras funciones del contexto
    const { setLocalSession, clearLocalSession } = useAuth() 

    async function handleLogin(form: LoginForm) {
        try{
            setLoading(true)
            setError(null)
            
            // 1. Llama al servicio (SQLite o Supabase, dependiendo del interruptor en authService)
            const user = await loginUser(form) 
            
            // 2. Le avisamos al contexto manualmente (Crucial para SQLite, inofensivo para Supabase)
            setLocalSession(user)              
            
            // 3. Pasamos al Home
            router.replace('/tabs/home')       
        }
        catch(e:any){
            setError(traducirError(e.message))
        }
        finally{
            setLoading(false)
        }
    }

    async function handleRegister(form: RegisterForm) {
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
        
        // Limpiamos la sesión manualmente (Crucial para SQLite)
        clearLocalSession() 
        
        router.replace('/autentificacion/login') 
    }

    return {handleLogin, handleRegister, handleLogout, loading, error}
}

function traducirError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos'
  if (message.includes('User already registered')) return 'Este correo ya está registrado'
  if (message.includes('Usuario no encontrado')) return 'Nombre de usuario no encontrado'
  if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres'
  return 'Ocurrió un error, intenta de nuevo'
}
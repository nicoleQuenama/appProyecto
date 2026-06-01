import React, {createContext, useContext, useEffect, useState} from 'react'
import { Session, User } from '@supabase/supabase-js'
import {supabase} from '../lib/supabase'

type AuthContextType={
    session: Session | any | null
    user: User | any | null
    loading: boolean 
    // 👇 Agregamos estas dos funciones para cuando usemos SQLite
    setLocalSession: (user: any) => void 
    clearLocalSession: () => void        
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading:true,
    setLocalSession: () => {},
    clearLocalSession: () => {},
})

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [session, setSession] = useState<Session | any | null>(null)
    const [user, setUser] = useState<User | any | null>(null)
    const [loading, setLoading]= useState(true)

    // ==========================================
    // 🛡️ CÓDIGO ORIGINAL SUPABASE (INTACTO)
    // ==========================================
    useEffect(()=>{
        // Verificacion si el usuario ya estaba logueado
        supabase.auth.getSession().then(({data:{session}})=>{
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Cambios de sesion, tokens, logout, y login
        const {data: {subscription}}= supabase.auth.onAuthStateChange(
            (_event, session)=>{
                setSession(session)
                setUser(session?.user ?? null)
            }
        )
        return () => subscription.unsubscribe()
    },[])

    // ==========================================
    // 🛠️ NUEVO CÓDIGO PARA SQLITE
    // ==========================================
    // Con Supabase la sesión se actualiza sola (arriba). 
    // Con SQLite, usamos esto para actualizarla "a mano".
    const setLocalSession = (userData: any) => {
        setSession({ access_token: 'sqlite-token-temporal' }) 
        setUser(userData)
    }

    const clearLocalSession = () => {
        setSession(null)
        setUser(null)
    }
    
    return (
        <AuthContext.Provider value={{session, user, loading, setLocalSession, clearLocalSession}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
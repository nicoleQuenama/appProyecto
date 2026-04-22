import 'react-native-url-polyfill/auto'
import {createClient} from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

//credenciales
const SUPABASE_URL= 'https://wlqcacczfzehiqdvqasy.supabase.co'
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscWNhY2N6ZnplaGlxZHZxYXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTU1MjksImV4cCI6MjA4OTg5MTUyOX0.kRAC3AzPCYmGdNVizB3UTUaXhyVw3512CZIUhBQ2N-E'

export const supabase= createClient(SUPABASE_URL, SUPABASE_ANON_KEY,{
    auth: {
        storage: AsyncStorage, //guardamos sesion
        autoRefreshToken:true,  
        persistSession:true,  
        detectSessionInUrl:false
    }
})
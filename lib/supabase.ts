import 'react-native-url-polyfill/auto'
import {createClient} from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

//credenciales
const SUPABASE_URL= 'https://oxskhcnmbppbotgsdsix.supabase.co'
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94c2toY25tYnBwYm90Z3Nkc2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTUzMjksImV4cCI6MjA5Mjk3MTMyOX0.98PmOozBrZVuMrBf3XPpy7qe4VMYYxtafHQid5rWJrQ'

export const supabase= createClient(SUPABASE_URL, SUPABASE_ANON_KEY,{
    auth: {
        storage: AsyncStorage, //guardamos sesion
        autoRefreshToken:true,  
        persistSession:true,  
        detectSessionInUrl:false
    }
})
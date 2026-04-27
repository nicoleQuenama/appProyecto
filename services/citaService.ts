import {supabase} from '../lib/supabase'
import { Cita} from '../schemas/citas.types'

export async function  getProximasCitas(pacienteId: string) : Promise<Cita[]>{
    const{data, error}= await supabase
    .from('citas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .eq('estado', 'pendiente')
    .order('fecha_hora', {ascending:true})
    .limit(5)

    if (error) throw error
    return data ?? []
}
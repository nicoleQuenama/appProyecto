import {supabase} from '../lib/supabase'
import { Reportes} from '../schemas/reportes.types'

export async function getReportes(pacienteId: string): Promise<Reportes[]>{
    const {data, error} = await supabase
    .from('reportes')
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('created_at', {ascending: false})
    .limit(5) //limite de reportes

    if (error) throw error
    return data ?? []
}
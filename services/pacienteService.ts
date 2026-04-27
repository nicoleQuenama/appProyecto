import {supabase} from '../lib/supabase'
import {Infante} from '../schemas/pacient_inf.types'

export async function getPacienteUsuario(usuarioId: string): Promise<Infante>{
    const {data, error} = await supabase
    .from('paciente_inf')
    .select('*')
    .eq('usuario_id', usuarioId)
    .maybeSingle() // si aun no tiene un paciente

    if(error) throw error
    return data
}
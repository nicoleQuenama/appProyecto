import { supabase } from '../lib/supabase'
import { db } from '../lib/database'
import { Reportes } from '../schemas/reportes.types'

const USAR_SQLITE = true;

async function getReportes_Supabase(pacienteId: string): Promise<Reportes[]> {
    const {data, error} = await supabase
    .from('reportes')
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('created_at', {ascending: false})
    .limit(5)

    if (error) throw error
    return data ?? []
}

async function getReportes_SQLite(pacienteId: string): Promise<Reportes[]> {
    const reportes: any[] = await db.getAllAsync(
        "SELECT * FROM reportes WHERE paciente_id = ? ORDER BY created_at DESC LIMIT 5",
        [pacienteId]
    );
    return reportes as Reportes[];
}

export const getReportes = USAR_SQLITE ? getReportes_SQLite : getReportes_Supabase;
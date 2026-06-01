import { supabase } from '../lib/supabase'
import { db } from '../lib/database'
import { Cita } from '../schemas/citas.types'

const USAR_SQLITE = true;

// ==========================================
// 1. OBTENER PRÓXIMAS 5 CITAS PENDIENTES
// ==========================================
async function getProximasCitas_Supabase(pacienteId: string): Promise<Cita[]> {
    const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .eq('estado', 'pendiente')
    .order('fecha_hora', { ascending: true })
    .limit(5)

    if (error) throw error
    return data ?? []
}

async function getProximasCitas_SQLite(pacienteId: string): Promise<Cita[]> {
    // Usamos ALIAS para mapear fecha_hora de la BD al tipo fecha_hor de la app
    const citas: any[] = await db.getAllAsync(
        "SELECT id, paciente_id, especialista, especialidad, lugar,fecha_hora AS fecha_hor, estado, created_at FROM citas WHERE paciente_id = ? AND estado = 'pendiente' ORDER BY fecha_hora ASC LIMIT 5",
        [pacienteId]
    );
    return citas as Cita[];
}

// ==========================================
// 2. OBTENER TODAS LAS CITAS (Para la Agenda)
// ==========================================
async function getAllCitas_Supabase(pacienteId: string): Promise<Cita[]> {
    const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('fecha_hora', { ascending: false })

    if (error) throw error
    return data ?? []
}

async function getAllCitas_SQLite(pacienteId: string): Promise<Cita[]> {
    const citas: any[] = await db.getAllAsync(
        "SELECT id, paciente_id, especialista, especialidad, lugar,fecha_hora AS fecha_hor, estado, created_at FROM citas WHERE paciente_id = ? ORDER BY fecha_hora DESC",
        [pacienteId]
    );
    return citas as Cita[];
}

// ==========================================
// 3. CREAR UNA NUEVA CITA
// ==========================================
async function crearCita_Supabase(cita: Partial<Cita>, pacienteId: string) {
    const { error } = await supabase
    .from('citas')
    .insert({
        especialista: cita.especialista,
        fecha_hora: cita.fecha_hor,
        estado: cita.estado ?? 'pendiente',
        paciente_id: pacienteId,
        especialidad: cita.especialidad ?? '',
        lugar: cita.lugar ?? ''
    })

    if (error) throw error
    return true
}

async function crearCita_SQLite(cita: Partial<Cita>, pacienteId: string) {
    const newId = Math.random().toString(36).substring(2, 15);
    await db.runAsync(
        `INSERT INTO citas (id, paciente_id, especialista,especialidad, lugar, fecha_hora, estado, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            newId,
            pacienteId,
            cita.especialista ?? '',
            cita.especialidad ?? '',
            cita.lugar ?? '',
            cita.fecha_hor ?? new Date().toISOString(),
            cita.estado ?? 'pendiente',
            new Date().toISOString()
        ]
    );
    return true;
}

// ==========================================
// 4. EXPORTACIONES DINÁMICAS
// ==========================================
export const getProximasCitas = USAR_SQLITE ? getProximasCitas_SQLite : getProximasCitas_Supabase;
export const getAllCitas = USAR_SQLITE ? getAllCitas_SQLite : getAllCitas_Supabase;
export const crearCita = USAR_SQLITE ? crearCita_SQLite : crearCita_Supabase;
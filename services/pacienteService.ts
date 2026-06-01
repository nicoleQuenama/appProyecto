import { supabase } from '../lib/supabase'
import { db } from '../lib/database'
import { Infante } from '../schemas/pacient_inf.types'

const USAR_SQLITE = true;

// ==========================================
// 1. VERSIÓN SUPABASE
// ==========================================
async function getPacienteUsuario_Supabase(usuarioId: string): Promise<Infante | null>{
    const {data, error} = await supabase
    .from('paciente_inf')
    .select('*')
    .eq('usuario_id', usuarioId)
    .maybeSingle() 

    if(error) throw error
    return data
}

async function registrarPaciente_Supabase(paciente: Partial<Infante>, usuarioId: string) {
    const { error } = await supabase.from('paciente_inf').insert({
        ...paciente,
        usuario_id: usuarioId
    });
    if (error) throw error;
    return true;
}

// Nueva función para el formulario de vinculación
async function vincularPaciente_Supabase(datos: {nombre: string, nacimiento: string, codigo: string}, usuarioId: string) {
    const { error } = await supabase.from('paciente_inf').insert({
        usuario_id: usuarioId,
        nombre: datos.nombre,
        codigo_vinculacion: datos.codigo,
        problemas_salud: 'Vinculado por código'
    });
    if (error) throw error;
    return true;
}

// ==========================================
// 2. VERSIÓN SQLITE
// ==========================================
async function getPacienteUsuario_SQLite(usuarioId: string): Promise<Infante | null> {
    const paciente: any = await db.getFirstAsync(
        'SELECT * FROM paciente_inf WHERE usuario_id = ?',
        [usuarioId]
    );
    return paciente ? (paciente as Infante) : null;
}

async function registrarPaciente_SQLite(paciente: Partial<Infante>, usuarioId: string) {
    const newId = Math.random().toString(36).substring(2, 15);
    
    await db.runAsync(
        `INSERT INTO paciente_inf (id, usuario_id, codigo_vinculacion, nombre, edad, genero, peso, estatura, nomtuto, problemas_salud, nivel_mejora)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            newId, 
            usuarioId, 
            paciente.codigo_vinculacion ?? null, 
            paciente.nombre ?? '', 
            paciente.edad ?? 0, 
            paciente.genero ?? '', 
            paciente.peso ?? 0, 
            paciente.estatura ?? 0, 
            paciente.nomtuto ?? '', 
            paciente.problemas_salud ?? '',
            paciente.nivel_mejora ?? 'basico' // valor por defecto para nivel_mejora
        ]
    );
    return true;
}

// Nueva función para el formulario de vinculación llenando campos obligatorios
async function vincularPaciente_SQLite(datos: {nombre: string, nacimiento: string, codigo: string}, usuarioId: string) {
    const newId = Math.random().toString(36).substring(2, 15);
    
    await db.runAsync(
        `INSERT INTO paciente_inf (id, usuario_id, codigo_vinculacion, nombre, edad, genero, peso, estatura, nomtuto, problemas_salud, nivel_mejora)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            newId, 
            usuarioId, 
            datos.codigo, 
            datos.nombre, 
            0, // edad por defecto
            '', // genero por defecto
            0,  // peso por defecto
            0,  // estatura por defecto
            '', // nomtuto por defecto
            'Vinculado por código', // problemas_salud por defecto
            'basico' // nivel_mejora por defecto
        ]
    );
    return true;
}
export async function actualizarNivelMejora(usuarioId: string, nuevoNivel: string) {
    await db.runAsync(
        `UPDATE paciente_inf SET nivel_mejora = ? WHERE usuario_id = ?`,
        [nuevoNivel, usuarioId]
    );
    return true;
} 
// ==========================================
// 3. EXPORTACIONES
// ==========================================
export const getPacienteUsuario = USAR_SQLITE ? getPacienteUsuario_SQLite : getPacienteUsuario_Supabase;
export const registrarPaciente = USAR_SQLITE ? registrarPaciente_SQLite : registrarPaciente_Supabase;
export const vincularPaciente = USAR_SQLITE ? vincularPaciente_SQLite : vincularPaciente_Supabase;
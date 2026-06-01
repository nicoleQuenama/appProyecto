export type Cita ={
    id: string
    paciente_id: string
    especialista: string
    especialidad?:string
    lugar?:string
    fecha_hor: string
    estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'
    created_at:string
}
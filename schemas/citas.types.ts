export type Cita ={
    id: string
    paciente_id: string
    especialista: string
    fecha_hor: string
    estado: 'pendiente' | 'confirmado' | 'cancelado'
    created_at:string
}
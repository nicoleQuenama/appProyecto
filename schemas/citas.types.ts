export type Cita ={
    id: string
    especialista: string
    fecha_hor: Date
    estado: 'pendiente' | 'confirmado' | 'cancelado'
    created_at:string
}
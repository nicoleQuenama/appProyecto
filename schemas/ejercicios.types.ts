export type Ejercicio = {
    id: string
    titulo: string
    descripcion: string
    nivel_dificultad: 'basico' | 'medio' | 'dificil'
    video_url: string
    archivo_url: string //ubicacion de videos de forma local
    is_active: boolean

}
import {db} from '../lib/database';

//funcion para obtener ejercicios para realizar en casa segun dificultad y nivel de pie plano
export async function obtenerEjercicioSegunDificultad(nivel:string){
    try{
        const ejercicios = await db.getAllAsync(
            "SELECT * FROM ejercicios WHERE nivel_dificultad = ? AND is_active = 1",
            [nivel]
        )
        return ejercicios;
    } catch (error) {
        console.error("Error al obtener ejercicios:", error);
        return [];
        throw error;
    }
}
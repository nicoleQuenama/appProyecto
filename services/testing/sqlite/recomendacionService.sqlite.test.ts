import {obtenerEjercicioSegunDificultad} from '../../../services/ejerciciosService';
import {db} from '../../../lib/database';

jest.mock('../../../lib/database', () => ({
    db:{
        getAllAsync: jest.fn()
    }
}));

describe('ejerciciosService (SQLite)', () =>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('trae los ejercicios recomendados filtrados por nivel y que sean activos', async() =>{

        //variable para prueba
        const mockRutina=[
            {
                id: 'e1',
                titulo: 'ejercicio 1',
                nivel_dificultad:'basico',
                is_active: true
            }
        ];

        (db.getAllAsync as jest.Mock).mockResolvedValue(mockRutina);

        const resultado = await obtenerEjercicioSegunDificultad('basico');
        expect(db.getAllAsync).toHaveBeenCalledTimes(1);

        const queryArgs = (db.getAllAsync as jest.Mock).mock.calls[0];
        expect(queryArgs[0]).toContain("WHERE nivel_dificultad = ? AND is_active = 1");
        expect(queryArgs[1]).toEqual(['basico']); 
        expect(resultado).toEqual(mockRutina);
    });
    it('debe manejar errores de base de datos retornando un array vacío', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (db.getAllAsync as jest.Mock).mockRejectedValue(new Error('DB Locked'));

    const resultado = await obtenerEjercicioSegunDificultad('basico');
    
    // La aplicación no debe romperse, debe devolver un array vacío según tu manejo de errores
    expect(resultado).toEqual([]); 
    consoleSpy.mockRestore();
  });
});
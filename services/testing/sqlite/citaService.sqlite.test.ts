// MOCKS PARA EVITAR EL INVARIANT VIOLATION (Debe ir antes de tus importaciones de servicios)
jest.mock('react-native-url-polyfill/auto', () => {});
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('../../../lib/supabase', () => ({
  supabase: { auth: jest.fn(), from: jest.fn() }
}));

jest.mock('../../../lib/database', () => ({
  db: {
    getAllAsync: jest.fn(),
    runAsync: jest.fn()
  }
}));
import {getProximasCitas, crearCita} from '../../../services/citaService';
import {db} from '../../../lib/database';

jest.mock('../../../lib/database', () => ({
    db:{
        getAllAsync: jest.fn(),
        runAsync: jest.fn()
    }
}));

describe('citaService (SQLite)', () =>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('getProximasVitas:  filtra las citas proximas, ademas segun el estado de si estan pedientes', async () =>{
        //variable para prueba
        const mockData= [{
            id: '1',
            especialista: 'Dr. Smith'
        }];
        (db.getAllAsync as jest.Mock).mockResolvedValue(mockData);

        const resultado = await getProximasCitas('paciente-1');
        expect(db.getAllAsync).toHaveBeenCalledTimes(1);

        const query = (db.getAllAsync as jest.Mock).mock.calls[0][0];

        //validaciones de sentencias SQL 
        expect(query).toContain("estado = 'pendiente'");
        expect(query).toContain("ORDER BY fecha_hora ASC");
        expect(query).toContain("LIMIT 5");
        expect(resultado).toEqual(mockData);
    });

    it('crearCita: debemos asignar el estado "pendiente" a la nueva cita', async() =>{
        (db.runAsync as jest.Mock).mockResolvedValue(true);

        //variable prueba
        const nuevaCita={
            especialista: 'Dra. Claros',
            fecha_hora: '2026-07-01T10:30:00Z',
        };
        await crearCita(nuevaCita, 'paciente-1');

        const args=(db.runAsync as jest.Mock).mock.calls[0][1];

        //estado ultimo valor en insertarse
        expect(args).toContain('pendiente');
        expect(args).toContain('paciente-1');
    });
});
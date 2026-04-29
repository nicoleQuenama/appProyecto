import { getProximasCitas } from "../../services/citaService";
import { supabase } from '../../lib/supabase';


const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn() 
};

// simulacion
jest.mock('../../lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => mockQueryBuilder) 
    }
}));

describe('citaService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe solicitar las citas pendientes y ordenarlos por fecha', async () => {
        const mockCitas = [
            { id: '1', paciente_id: '1', especialista: 'Franz', fecha_hora: '2026-04-02T10:00:00Z', estado: 'pendiente' }
        ];

        mockQueryBuilder.limit.mockResolvedValue({
            data: mockCitas,
            error: null
        });
        const resultado = await getProximasCitas('1');

        expect(supabase.from).toHaveBeenCalledWith('citas');
        expect(mockQueryBuilder.select).toHaveBeenCalledWith('*');
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('paciente_id', '1');
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('estado', 'pendiente');
        expect(mockQueryBuilder.order).toHaveBeenCalledWith('fecha_hora', { ascending: true });
        
        expect(resultado).toEqual(mockCitas);
    });
});
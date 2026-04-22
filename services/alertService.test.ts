import { getRecentAlerts } from './alertService';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn()
  }
}));

describe('alertService - getRecentAlerts', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retornaun array vacío si ocurre un error al buscar al paciente', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Paciente no encontrado' } 
        })
      })
    });

    const resultado = await getRecentAlerts();

    expect(resultado).toEqual([]);
  });

  it('debe retornar las alertas si el paciente existe', async () => {

    const mockFrom = supabase.from as jest.Mock;
    
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ 
          data: { id: 'paciente-123' }, 
          error: null 
        })
      })
    });

    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: [
                { id: '1', message: 'Alerta 1' },
                { id: '2', message: 'Alerta 2' }
              ],
              error: null
            })
          })
        })
      })
    });

    const resultado = await getRecentAlerts();
    expect(resultado.length).toBe(2);
    expect(resultado[0].message).toBe('Alerta 1');
  });
});
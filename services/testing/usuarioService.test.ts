import { getUsuario } from '../../services/usuarioService';
import { supabase } from '../../lib/supabase';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn()
};

// simulamos
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn() },
    from: jest.fn(() => mockQueryBuilder)
  }
}));

describe('usuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('solicita columnas correctas sin pedir contrasena', async () => {
    // Simulamos la sesión del usuario
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-uuid-123' } }
    });

    // Simulamos la respuesta final en maybeSingle directamente sobre nuestro mockQueryBuilder
    mockQueryBuilder.maybeSingle.mockResolvedValue({
      data: { id: 'test-uuid-123', fullname: 'Andrea', email: 'andrea@gmail.com' },
      error: null
    });

    await getUsuario(1);

    // Validamos que se hayan llamado las funciones correctas
    expect(supabase.from).toHaveBeenCalledWith('usuarios');
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'id, fullname, username, email, phone, gender, relation_pacien, fecha_nacimiento, address, token_not'
    );
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'test-uuid-123');
  });

  it('lanzar error si no hay sesion activa', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null }
    });

    await expect(getUsuario(1)).rejects.toThrow('No hay una sesión de usuario activa');
  });
});
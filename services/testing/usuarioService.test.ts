import {supabase} from '../../lib/supabase';
import {getUsuario} from '../../services/usuarioService';

const mockMaybeSingle= jest.fn();
const mockEq= jest.fn().mockReturnValue({maybeSingle:mockMaybeSingle});
const mockSelect = jest.fn().mockReturnValue({eq: mockEq});
//simulamos
jest.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {getUser:jest.fn()},
        from: jest.fn().mockReturnThis(),
    }
}));

describe('usuarioService', () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it ('solicita columnas correctas sin pedir contrasena', async() => {
        //simulacion de sesion activa
        (supabase.auth.getUser as jest.Mock).mockResolvedValue({
            data:{user: {id: '1'}}
        });

        //simulacion de respuesta de la bd
        mockMaybeSingle.mockResolvedValue({
            data: {id: '1', fullname: 'Nicole', email: 'nicole@gmail.com'},
            error:null
        });

        await getUsuario();

        //verificacion de los nombres de las columnas
        expect(mockSelect).toHaveBeenCalledWith(
            'id, fullname, username, email, phone, gener, relation_pacien, fecha_nacimiento,address'
        );
        expect(mockEq).toHaveBeenCalledWith('id', '1');
    });

    it('lanzar error si no hay sesion activa', async() => {
        (supabase.auth.getUser as jest.Mock).mockResolvedValue({
            data:{user: null}
        });
        await expect(getUsuario(1)).rejects.toThrow('No hay sesión activa');
    });
})

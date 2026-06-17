// MOCKS PARA EVITAR EL INVARIANT VIOLATION
jest.mock('react-native-url-polyfill/auto', () => {});
jest.mock('@react-native-async-storage/async-storage', () => ({}));
import {registrarUsuario, loginUser} from '../../../services/authService';
import {db} from '../../../lib/database';
import {RegisterForm, LoginForm} from  '../../../schemas/auth.types';

jest.mock('../../../lib/supabase', () => ({
  supabase: { auth: jest.fn(), from: jest.fn() }
}));

//simulacion de  la bd (mock)
jest.mock('../../../lib/database', () => ({
    db :{
        runAsync: jest.fn(),
        getFirstAsync: jest.fn()
    }
}));

describe('authService (SQlite',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

describe('Registrar Usuario',()=>{
    it('debe construir el INSERT correcto y devolver el usuario', async()=>{
        (db.runAsync as jest.Mock).mockResolvedValue(true);

        //datos de prueba
        const form: RegisterForm = {
        id: 'us-1',
        fullName: 'Susana Calizaya',
        username: 'susanita',
        email: 'SUSANITA@outlok.com',
        password: '123456789',
        phone: '78561345',
        gender: 'femenino',
        relation_pacien: 'Madre',
        fecha_nacimiento: new Date('1990-07-09'),
        address: 'Heroinas y Hamiraya',
        token_not: null
    };
    const result = await registrarUsuario(form);

    expect(db.runAsync).toHaveBeenCalled();

    const args = (db.runAsync as jest.Mock).mock.calls[0];
    //logica de negocio
    expect(args[0]).toContain('INSERT INTO usuarios');
    expect(args[1]).toContain('susanita@outlok.com'); // 'email correcto'
    expect(result).toHaveProperty('id', 'us-1');    
    expect(result).toHaveProperty('username', 'susanita');
    });
});

describe('Logueo de Usuario',() => {
    it('debe usar la consulta de extension si la entrada tiene un @', async() =>{
        (db.getFirstAsync as jest.Mock).mockResolvedValue({
            id: '1',
            email: 'test@mail.com'
        });

        //variable de prueba
    const form: LoginForm = {
        emailOrUsername: 'test@gmail.com', //modificar para probar que de 
        password: 'abcdefg8'
    };
    await loginUser(form);

    const args = (db.getFirstAsync as jest.Mock).mock.calls[0];
    expect(args[0]).toContain('WHERE email = ?');
    expect(args[1][0]).toBe('test@gmail.com'); //dato correcto
    });

    it('debe usar la consulta de username si la entrada no tiene un "@"', async() => {
        (db.getFirstAsync as jest.Mock).mockResolvedValue({
            id: '1',
            username: 'testeador'
        });
        
        //variable de prueba
        const form: LoginForm = {
            emailOrUsername: 'testeador',
            password: 'abcdefg8'
        };
        await loginUser(form);

        const args = (db.getFirstAsync as jest.Mock).mock.calls[0];
        expect(args[0]).toContain('WHERE username = ?'); //debe detectar si esta usando el username
    });
});
});


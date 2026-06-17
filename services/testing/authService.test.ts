jest.mock('react-native-url-polyfill/auto', () => {});
jest.mock('@react-native-async-storage/async-storage', () => ({}));
//mockeo of the db
jest.mock('../../lib/supabase', ()=> ({
    supabase: {
        auth: jest.fn(),
    }
}));
jest.mock('../../lib/database', () => ({
    db: {} 
}));
import { traducirError } from "../authService";

// prueba unitaria para la función traducirError
describe('traducirError', () => {
    it('devuelve mensajes entendibles para las credenciales de los usuarios', () =>{
        const error= 'Invalid login credentials';
        expect(traducirError(error)).toBe('Correo o contraseña incorrectos');
    });

    //validacion de intento de logueo varias veces
    it('traduce el error de limite de correos', () => {
        const error = 'email rate limit exceeded';
        expect(traducirError(error)).toBe('Demasiados intentos. Por favor, espera un momento y vuelve a intentar.');
    })

    it('retorna mensajes si el error no es reconocido', () => {
        const error= 'Error del servidor';
        expect(traducirError(error)).toBe('Ocurrió un error, intenta de nuevo');
    });

});
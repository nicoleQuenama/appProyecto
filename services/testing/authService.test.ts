import { traducirError } from "../authService";

// prueba unitaria para la función traducirError

jest.mock('../../lib/supabase', ()=> ({
    supabase: {
        auth: jest.fn(),
    }
}));

describe('traducirError', () => {
    it('devuelve mensajes entendibles para las credenciales de los usuarios', () =>{
        const error= 'Invalid login credentials';
        expect(traducirError(error)).toBe('Correo o contraseña incorrectos');
    });

    //validacion de intento de logueo varias veces
    it('traduce el error de limite de correos', () => {
        const error = 'email limite exceeded';
        expect(traducirError(error)).toBe('Has intentado iniciar sesión demasiadas veces. Por favor, espera un momento e inténtalo de nuevo.');
    })

    it('retorna mensajes si el error no es reconocido', () => {
        const error= 'Error del servidor';
        expect(traducirError(error)).toBe('Ocurrió un error, intenta de nuevo');
    });

});
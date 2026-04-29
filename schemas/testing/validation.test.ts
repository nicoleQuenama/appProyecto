import { validarRegistro } from './validation';
import { RegisterForm } from '../auth.types';

describe('Validación de Datos', () => {

  const usuarioValido: RegisterForm = {
    id: '1',
    fullName: 'Alex Perez',
    username: 'alexp',
    email: 'alex@mail.com',
    password: 'password123',
    phone: '123456789',
    gender: 'masculino',
    relation_pacien:'tutor legal',
    fecha_nacimiento: new Date('1980-05-04'),
    address: 'Calle Falsa 123',
    token_not: null
  };

  it('si los datos son correctos pasamos la validacion', () => {
    const resultado = validarRegistro(usuarioValido);
    expect(resultado).toBeNull();
  });

  it('si el correo no tiene una extension o un @ no es  valido', () => {
    const usuarioConMalCorreo = { ...usuarioValido, email: 'alex-en-gmail.com' };
    const resultado = validarRegistro(usuarioConMalCorreo);
    expect(resultado).toBe('El formato del correo es inválido');
  });

  it('si la contraseña es muy corta, se rechaza', () => {
    const usuarioConMalaClave = { ...usuarioValido, password: '123' };
    const resultado = validarRegistro(usuarioConMalaClave);
    expect(resultado).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('si el campo del nombre esta vacio o solo son espacios, se rechaza', () => {
    const usuarioConMalNombre = { ...usuarioValido, fullName: '    ' };
    const resultado = validarRegistro(usuarioConMalNombre);
    expect(resultado).toBe('El nombre completo es obligatorio');
  });
});
import { RegisterForm } from './auth.types';

export function validarRegistro(form: RegisterForm): string | null {
  if (form.fullName.trim() === '') {
    return 'El nombre completo es obligatorio';
  }
  
  if (!form.email.includes('@') || !form.email.includes('.')) {
    return 'El formato del correo es inválido';
  }
  
  if (form.password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  return null; 
}
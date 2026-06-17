import { $, browser } from '@wdio/globals'; // Cambiamos 'driver' por 'browser'

describe('Flujo de Login de Equilibra', () => {
    it('Debe escribir el correo, contraseña y presionar el botón', async () => {
        // 1. Encontrar el campo de email (Appium usa el prefijo ~ para los testID)
        const inputEmail = await $('~input-email');
        await inputEmail.waitForDisplayed({ timeout: 10000 }); // Espera hasta 10 seg a que cargue la app
        await inputEmail.setValue('test@gmail.com'); // El robot escribe esto

        // 2. Encontrar el campo de contraseña
        const inputPassword = await $('~input-password');
        await inputPassword.setValue('123456'); // El robot escribe esto

        // 3. Encontrar y presionar el botón de login
        const btnLogin = await $('~btn-login');
        await btnLogin.click(); // El robot hace clic

        // Usamos browser.pause en lugar de driver.pause
        await browser.pause(3000); 
    });
});
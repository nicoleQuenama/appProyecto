import { $, browser } from '@wdio/globals'; // Cambiamos 'driver' por 'browser'

describe('Flujo de Login de Equilibra', () => {
    it('Debe escribir el correo, contraseña y presionar el botón', async () => {
        const inputEmail = await $('~input-email');
        await inputEmail.waitForDisplayed({ timeout: 10000 }); 
        await inputEmail.setValue('test@gmail.com'); 

        const inputPassword = await $('~input-password');
        await inputPassword.setValue('123456'); 

        const btnLogin = await $('~btn-login');
        await btnLogin.click(); 

        await browser.pause(3000); 
    });
});
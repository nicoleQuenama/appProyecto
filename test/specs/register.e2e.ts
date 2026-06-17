import { $, browser } from '@wdio/globals';

describe('Flujo de Registro de Equilibra', () => {
    it('Debe navegar al registro, llenar todos los datos y presionar el botón', async () => {
        const linkRegister = await $('~link-register');
        await linkRegister.waitForDisplayed({ timeout: 10000 });
        await linkRegister.click();

        const inputFullName = await $('~input-fullName');
        await inputFullName.waitForDisplayed({ timeout: 10000 });
        await inputFullName.setValue('Juan Pérez');

        const inputUsername = await $('~input-username');
        await inputUsername.setValue('juanperez');

        const inputEmail = await $('~input-email');
        await inputEmail.setValue('juan@test.com');

        const inputPassword = await $('~input-password');
        await inputPassword.setValue('123456');

        const inputPhoneNumber = await $('~input-phoneNumber');
        await inputPhoneNumber.setValue('70000000');
        await browser.pause(500);

        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Relación con el paciente")');
        await browser.pause(500);
        const inputRelation = await $('~input-relation');
        await inputRelation.setValue('Padre');

        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Dirección")');
        await browser.pause(500);
        const inputAddress = await $('~input-address');
        await inputAddress.setValue('Calle Falsa 123');

        await browser.pause(500);
        const btnRegister = await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Completar registro")');
        await btnRegister.click();

        await browser.pause(3000);
    });
});

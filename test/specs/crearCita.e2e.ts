import { $, browser } from '@wdio/globals';

const CORREO = `cita_${Date.now()}@test.com`;
const PASSWORD = '123456';
const USUARIO = `citatest_${Date.now()}`;

describe('Flujo de Crear Cita de Equilibra', () => {
    it('Debe registrar usuario, vincular paciente y solicitar una cita', async () => {
        // 1. Navegar a registro
        const linkRegister = await $('~link-register');
        await linkRegister.waitForDisplayed({ timeout: 10000 });
        await linkRegister.click();

        // 2. Registrar nuevo usuario
        const inputFullName = await $('~input-fullName');
        await inputFullName.waitForDisplayed({ timeout: 10000 });
        await inputFullName.setValue('Cita Test');

        const inputUsername = await $('~input-username');
        await inputUsername.setValue(USUARIO);

        const inputEmail = await $('~input-email');
        await inputEmail.setValue(CORREO);

        const inputPassword = await $('~input-password');
        await inputPassword.setValue(PASSWORD);

        await browser.pause(500);
        const btnRegister = await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Completar registro")');
        await btnRegister.click();

        // 3. Esperar alerta de registro exitoso y aceptarla
        await browser.pause(2000);
        try {
            await browser.acceptAlert();
        } catch (_) { /* no hay alerta */ }
        await browser.pause(1000);

        // 4. Login con el usuario recién creado
        const loginEmail = await $('~input-email');
        await loginEmail.waitForDisplayed({ timeout: 10000 });
        await loginEmail.setValue(CORREO);

        const loginPassword = await $('~input-password');
        await loginPassword.setValue(PASSWORD);

        const btnLogin = await $('~btn-login');
        await btnLogin.click();

        // 5. Esperar a que cargue la app y navegar a Agenda
        await browser.pause(3000);
        const tabAgenda = await $('~tab-agenda');
        await tabAgenda.waitForDisplayed({ timeout: 15000 });
        await tabAgenda.click();

        // 6. Vincular paciente (botón visible porque no hay paciente vinculado aún)
        await browser.pause(1000);
        const btnVincular = await $('~btn-vincular-expediente');
        await btnVincular.waitForDisplayed({ timeout: 10000 });
        await btnVincular.click();

        // 7. Llenar formulario de vinculación de paciente
        const inputCodigo = await $('~input-codigo-vinculacion');
        await inputCodigo.waitForDisplayed({ timeout: 10000 });
        await inputCodigo.setValue('EQ-9999-TEST');

        const inputNombrePaciente = await $('~input-nombre-paciente');
        await inputNombrePaciente.setValue('Ana Test');

        const inputGenero = await $('~input-genero-paciente');
        await inputGenero.click();
        await browser.pause(500);
        const optFemenino = await $('~opt-genero-Femenino');
        await optFemenino.waitForDisplayed({ timeout: 5000 });
        await optFemenino.click();

        const btnGuardarVinculacion = await $('~btn-vincular-expediente');
        await btnGuardarVinculacion.click();

        // 8. Aceptar alerta de vinculación exitosa
        await browser.pause(2000);
        try {
            await browser.acceptAlert();
        } catch (_) { /* no hay alerta */ }
        await browser.pause(1000);

        // 9. Volver a la Agenda
        const tabAgenda2 = await $('~tab-agenda');
        await tabAgenda2.waitForDisplayed({ timeout: 10000 });
        await tabAgenda2.click();

        // 10. Click "Agendar nueva cita"
        await browser.pause(1000);
        const btnAgendar = await $('~btn-agendar-nueva-cita');
        await btnAgendar.waitForDisplayed({ timeout: 10000 });
        await btnAgendar.click();

        // 11. Llenar formulario de cita
        const inputEspecialidad = await $('~input-especialidad');
        await inputEspecialidad.waitForDisplayed({ timeout: 10000 });
        await inputEspecialidad.click();

        const optPediatria = await $('~opt-especialidad-Pediatría');
        await optPediatria.waitForDisplayed({ timeout: 5000 });
        await optPediatria.click();

        const inputEspecialista = await $('~input-especialista');
        await inputEspecialista.click();

        const optDra = await $('~opt-especialista-Dra. Leszly Diaz');
        await optDra.waitForDisplayed({ timeout: 5000 });
        await optDra.click();

        const inputLugar = await $('~input-lugar');
        await inputLugar.setValue('Consultorio 3');

        await browser.hideKeyboard();

        const btnSolicitar = await $('~btn-solicitar-cita');
        await btnSolicitar.click();

        // 12. Aceptar alerta de cita creada
        await browser.pause(2000);
        try {
            await browser.acceptAlert();
        } catch (_) { /* no hay alerta */ }

        await browser.pause(3000);
    });
});

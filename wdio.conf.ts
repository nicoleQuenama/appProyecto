export const config: WebdriverIO.Config | any = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    tsConfigPath: './tsconfig.e2e.json',
    
    port: 4723,
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/**/*.ts' 
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    //
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        
        // --- 1. CONFIGURACIÓN DE TU APP NATIVA ---
        // TODO: Reemplaza esto con el "package" exacto que tienes en tu app.json
        'appium:appPackage': 'com.equilibra.app', 
        'appium:appActivity': '.MainActivity',
        'appium:autoGrantPermissions': true,
        'appium.app': './app/build/app-debug.apk',

        // --- 2. CONFIGURACIÓN DEL EMULADOR INVISIBLE ---
        // TODO: Reemplaza esto con el nombre de tu emulador (lo ves en Android Studio)
        // Ojo: Cambia los espacios del nombre por guiones bajos (_). Ej: Pixel_4_API_31
        'appium:avd': 'telefonoAPI_36', 
        'appium:isHeadless': true
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    services: ['appium'],

    // Framework you want to run your specs with.
    framework: 'mocha',
    
    // Test reporter for stdout.
    reporters: ['spec', ['allure', {
        outputDir: 'allure-results', 
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false, 
    }]],

    // Options to be passed to Mocha.
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    // =====
    // Hooks
    // =====
    // ... (El resto de hooks comentados se mantienen igual)
}
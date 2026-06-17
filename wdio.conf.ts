import path from 'path';

export const config: WebdriverIO.Config | any = {
    //
    // ====================
    // Runner Configuration
    // ====================
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
    exclude: [
    ],
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    //
    capabilities: [{
        platformName: 'Android',
        'appium:options': {
            automationName: 'UiAutomator2',
            udid: 'R5CX31SEXGE', 
            app: path.join(process.cwd(), 'builds/app-debug.apk'), 
            appPackage: 'com.nicolequenama.equilibra',
            appActivity: '.MainActivity',
            autoGrantPermissions: true, 
            isHeadless: false 
        }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    
    reporters: ['spec', ['allure', {
        outputDir: 'allure-results', 
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false, 
    }]],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
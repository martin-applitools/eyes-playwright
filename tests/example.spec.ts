// This test case spec contains everything needed to run a full visual test against the ACME bank site.
// It runs the test locally using the Applitools classic runner.
// If you want to run cross-browser visual tests, consider using the Ultrafast Grid.

import { test } from '@playwright/test';
import {
  ClassicRunner,
  BatchInfo,
  Configuration,
  Eyes,
  Target,
  VisualGridRunner,
  AccessibilityGuidelinesVersion,
  AccessibilityLevel,
  StitchMode,
  RectangleSize,
  BrowserType,
  DeviceName,
  IOSDeviceInfo,
  IosDeviceName, IosVersion, ScreenOrientation, EyesRunner, FileLogHandler,

} from '@applitools/eyes-playwright';


// Applitools objects to share for all tests
export let Runner: EyesRunner;
export let Batch: BatchInfo;
export let Config: Configuration;
export let batchSequence = 'Playwright SDK'
export let appName = 'playwright.sdk'
export let isVisualGrid = false;
export let apiKeyDev = true
export let prospectName = "Playwright SDK"

// test.describe.configure({ mode: 'parallel' });

test.beforeAll(async() => {
  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Create the runner.
  if (isVisualGrid) {
    Runner = new VisualGridRunner({testConcurrency: 20});
    Config.addBrowser(1400, 900, BrowserType.CHROME);
    Config.addBrowser(1400, 900, BrowserType.FIREFOX);
    Config.addBrowser(1400, 900, BrowserType.SAFARI);
    Config.addBrowser(1920, 1080, BrowserType.CHROME);
    Config.addBrowser(1920, 1080, BrowserType.FIREFOX);
    Config.addBrowser(1920, 1080, BrowserType.SAFARI);

    // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
    // Other mobile devices are available, including iOS.
    Config.addDeviceEmulation(DeviceName.Pixel_4);
    Config.addBrowser({iosDeviceInfo: {deviceName: IosDeviceName.iPhone_14}})
    // Config.addBrowser({iosDeviceInfo: {deviceName: IosDeviceName.iPad_9}})
    Config.setLayoutBreakpoints([500])
    Config.setDisableBrowserFetching(false)
  }
  else {
    Runner = new ClassicRunner();
    Config.setStitchMode(StitchMode.CSS);
  }
  if (apiKeyDev) {
    Config.setApiKey(process.env.APPLITOOLS_API_KEY_DEV);
  }
  else {
    Config.setApiKey(process.env.APPLITOOLS_API_KEY_DEV);
  }

  Batch = new BatchInfo({name: 'Playwright SDK TypeScript',
    sequenceName: batchSequence, properties:[{name: 'Demo', value: prospectName}], notifyOnCompletion: true});

  // Set the batch for the config.
  Config.setBatch(Batch);


  //Accessibility Configuration
  Config.setAccessibilityValidation({guidelinesVersion: "WCAG_2_1", level: "AA"})
  //App Name Config
  Config.setAppName(appName)
  //Set Viewport Config
  Config.setViewportSize({width: 1400, height:900})
});

// This method performs cleanup after Suite.
test.afterAll(async () => {
  const results = await Runner.getAllTestResults(false);
  console.log('Visual test results', results);
});
// This "describe" method contains related test cases with per-test setup and cleanup.
// In this example, there is only one test.
test.describe('Playwright SDK Example', () => {

  // Test-specific objects
  let eyes: Eyes;

  test('Log into a bank account', async ({ page }) => {
    eyes = new Eyes(Runner, Config);
    //eyes.setLogHandler(new FileLogHandler(false, 'eyes.log', false))
    Config.setTestName(test.info().title)
    eyes.setConfiguration(Config);
    await eyes.open(page);
    // Load the login page.
    await page.goto('https://demo.applitools.com');
    // Verify the full login page loaded correctly.
    await eyes.check('Login page', Target.window().fully());

    // Perform login.
    await page.locator('id=username').fill('andy');
    await page.locator('id=password').fill('i<3pandas');
    await page.locator('id=log-in').click();

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check('Main page', Target.window().fully());
    //Close Eyes
    await eyes.close();
    //Close Page
    await page.close(); 
  });
  test('Open McDonalds Website', async ({ page }) => {
    eyes = new Eyes(Runner, Config);
    //eyes.setLogHandler(new FileLogHandler(false, 'eyes.log', false))
    Config.setTestName(test.info().title)
    eyes.setConfiguration(Config);
    await eyes.open(page);
    // Load the login page.
    await page.goto('https://www.mcdonalds.com/us/en-us.html');

    await page.locator('id=onetrust-close-btn-container').click()
  
    // Verify the Home page loaded correctly.
    await eyes.check('Home Page', Target.window().fully());
    
    //Close Eyes
    await eyes.close();
    //Close Page
    await page.close(); 
  });

});

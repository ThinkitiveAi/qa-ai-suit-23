// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  retries: 0,
  use: {
    headless: false, // Set to true for CI/CD pipelines
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://stage_ketamin.uat.provider.ecarehealth.com',
    trace: 'on-first-retry',
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});

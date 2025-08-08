import { test, expect } from '@playwright/test';

// Common test credentials to try
const testCredentials = [
  { email: 'admin@test.com', password: 'admin123' },
  { email: 'test@test.com', password: 'test123' },
  { email: 'user@test.com', password: 'password' },
  { email: 'demo@test.com', password: 'demo123' },
  { email: 'admin@ecarehealth.com', password: 'admin123' },
  { email: 'test@ecarehealth.com', password: 'test123' },
  { email: 'provider@test.com', password: 'provider123' },
  { email: 'doctor@test.com', password: 'doctor123' },
  { email: 'amanda.lee@ecarehealth.com', password: 'Admin@123' },
  { email: 'amanda.lee@test.com', password: 'Admin@123' },
  { email: 'admin@stage_aithinkitive.com', password: 'admin123' },
  { email: 'test@stage_aithinkitive.com', password: 'test123' }
];

test('Test Different Credentials', async ({ page }) => {
  console.log('🔄 Testing different credentials...');
  
  for (let i = 0; i < testCredentials.length; i++) {
    const creds = testCredentials[i];
    console.log(`\n🔑 Trying credentials ${i + 1}/${testCredentials.length}: ${creds.email}`);
    
    // Navigate to login page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Fill credentials
    await page.getByRole('textbox', { name: 'Email' }).fill(creds.email);
    await page.getByRole('textbox', { name: '*********' }).fill(creds.password);
    
    // Click login
    await page.getByRole('button', { name: "Let's get Started" }).click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check if we're still on login page
    const stillOnLoginPage = await page.getByRole('textbox', { name: 'Email' }).isVisible();
    
    if (!stillOnLoginPage) {
      console.log(`✅ SUCCESS! Credentials work: ${creds.email} / ${creds.password}`);
      console.log(`📍 Current URL: ${page.url()}`);
      
      // Take a screenshot
      await page.screenshot({ path: `success-login-${i}.png` });
      
      // Check what's on the page
      const pageContent = await page.content();
      if (pageContent.includes('Dashboard')) console.log('  - Dashboard found');
      if (pageContent.includes('Settings')) console.log('  - Settings found');
      if (pageContent.includes('Create')) console.log('  - Create found');
      if (pageContent.includes('Welcome')) console.log('  - Welcome found');
      
      break;
    } else {
      console.log(`❌ Failed: ${creds.email}`);
      
      // Check for error message
      const errorMessages = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').count();
      if (errorMessages > 0) {
        const errorText = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').first().textContent();
        console.log(`  Error: ${errorText}`);
      }
    }
  }
  
  console.log('\n✅ Credential testing completed');
}); 
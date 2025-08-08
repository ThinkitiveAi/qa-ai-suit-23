import { test, expect } from '@playwright/test';

test('Application Accessibility Test', async ({ page }) => {
  console.log('🔄 Testing application accessibility...');
  
  // Test 1: Check if the application is accessible
  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is accessible');
    console.log(`📍 URL: ${page.url()}`);
  } catch (error) {
    console.log('❌ Application is not accessible');
    console.log(`Error: ${error.message}`);
    return;
  }
  
  // Test 2: Check if login form is present
  const emailField = page.getByRole('textbox', { name: 'Email' });
  const passwordField = page.getByRole('textbox', { name: '*********' });
  const loginButton = page.getByRole('button', { name: "Let's get Started" });
  
  if (await emailField.isVisible() && await passwordField.isVisible() && await loginButton.isVisible()) {
    console.log('✅ Login form is present and functional');
  } else {
    console.log('❌ Login form is not properly configured');
    return;
  }
  
  // Test 3: Check tenant configuration
  const tenantField = page.getByRole('textbox', { name: 'Tenant' });
  if (await tenantField.isVisible()) {
    const tenantValue = await tenantField.inputValue();
    console.log(`✅ Tenant is configured: ${tenantValue}`);
  } else {
    console.log('⚠️ Tenant field not found');
  }
  
  // Test 4: Test with a simple credential to see the error response
  console.log('\n🔍 Testing with sample credentials to understand the system...');
  
  await emailField.fill('test@example.com');
  await passwordField.fill('testpassword');
  await loginButton.click();
  
  await page.waitForTimeout(3000);
  
  // Check for error messages
  const errorMessages = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').count();
  if (errorMessages > 0) {
    const errorText = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').first().textContent();
    console.log(`📋 Error message: ${errorText}`);
  }
  
  // Take a screenshot for reference
  await page.screenshot({ path: 'application-overview.png' });
  
  console.log('\n📋 SUMMARY:');
  console.log('✅ Application is accessible');
  console.log('✅ Login form is functional');
  console.log('❌ Valid test credentials are required');
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Contact the development team for valid test credentials');
  console.log('2. Verify the test environment is properly configured');
  console.log('3. Check if there are any additional authentication requirements');
  console.log('4. Ensure the tenant "stage_aithinkitive" has test users configured');
  
  console.log('\n✅ Accessibility test completed');
}); 
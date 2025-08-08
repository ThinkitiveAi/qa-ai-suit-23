import { test, expect } from '@playwright/test';

test('Login Debug Test', async ({ page }) => {
  console.log('🔄 Starting login debug test...');
  
  // Listen for network requests
  const requests = [];
  page.on('request', request => {
    const requestData = {
      url: request.url(),
      method: request.method(),
      headers: request.headers()
    };
    
    // If it's a POST request to the login API, capture the body
    if (request.method() === 'POST' && request.url().includes('/api/master/login')) {
      try {
        const data = request.postData();
        requestData.body = data;
        console.log('📤 Login request body:', data);
      } catch (error) {
        console.log('📤 Login request body: Could not capture');
      }
    }
    
    requests.push(requestData);
  });
  
  // Listen for responses
  const responses = [];
  page.on('response', response => {
    const responseData = {
      url: response.url(),
      status: response.status(),
      statusText: response.statusText()
    };
    
    // If it's a response from the login API, capture the body
    if (response.url().includes('/api/master/login')) {
      response.text().then(text => {
        responseData.body = text;
        console.log('📥 Login response body:', text);
      }).catch(() => {
        console.log('📥 Login response body: Could not capture');
      });
    }
    
    responses.push(responseData);
  });
  
  // Navigate to the page
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  console.log(`📍 Initial URL: ${page.url()}`);
  
  // Check if login form is visible
  const emailField = page.getByRole('textbox', { name: 'Email' });
  const passwordField = page.getByRole('textbox', { name: '*********' });
  const loginButton = page.getByRole('button', { name: "Let's get Started" });
  
  await expect(emailField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();
  
  console.log('✅ Login form is visible');
  
  // Check tenant field
  const tenantField = page.getByRole('textbox', { name: 'Tenant' });
  if (await tenantField.isVisible()) {
    const tenantValue = await tenantField.inputValue();
    console.log(`📍 Tenant field value: ${tenantValue}`);
  }
  
  // Fill credentials
  await emailField.fill('amanda.lee@healthcaretest.com');
  await passwordField.fill('Admin@123');
  
  console.log('✅ Credentials filled');
  
  // Click login button
  await loginButton.click();
  
  console.log('✅ Login button clicked');
  
  // Wait a moment and check for validation messages
  await page.waitForTimeout(2000);
  
  // Check for validation messages
  const validationMessages = await page.locator('text=required, text=Required, text=invalid, text=Invalid, text=error, text=Error').count();
  console.log(`📍 Validation messages found: ${validationMessages}`);
  
  if (validationMessages > 0) {
    const validationText = await page.locator('text=required, text=Required, text=invalid, text=Invalid, text=error, text=Error').first().textContent();
    console.log(`📍 Validation message: ${validationText}`);
  }
  
  // Wait a bit and check what happens
  await page.waitForTimeout(5000);
  
  console.log(`📍 URL after login attempt: ${page.url()}`);
  
  // Check if we're still on the login page
  const stillOnLoginPage = await emailField.isVisible();
  console.log(`📍 Still on login page: ${stillOnLoginPage}`);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'login-debug-screenshot.png' });
  
  // Check for any error messages
  const errorMessages = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed').count();
  console.log(`📍 Error messages found: ${errorMessages}`);
  
  if (errorMessages > 0) {
    const errorText = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed').first().textContent();
    console.log(`📍 Error message: ${errorText}`);
  }
  
  // Check page content for debugging
  const pageContent = await page.content();
  console.log('🔍 Page content includes:');
  if (pageContent.includes('Dashboard')) console.log('  - Dashboard');
  if (pageContent.includes('Settings')) console.log('  - Settings');
  if (pageContent.includes('Create')) console.log('  - Create');
  if (pageContent.includes('Welcome')) console.log('  - Welcome');
  if (pageContent.includes('Home')) console.log('  - Home');
  
  // Log network activity
  console.log('🌐 Network requests made:');
  requests.forEach((req, index) => {
    if (req.url.includes('login') || req.url.includes('auth')) {
      console.log(`  ${index + 1}. ${req.method} ${req.url}`);
    }
  });
  
  console.log('🌐 Network responses received:');
  responses.forEach((resp, index) => {
    if (resp.url.includes('login') || resp.url.includes('auth')) {
      console.log(`  ${index + 1}. ${resp.status} ${resp.statusText} - ${resp.url}`);
    }
  });
  
  console.log('✅ Login debug test completed');
}); 
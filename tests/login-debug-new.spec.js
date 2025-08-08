import { test, expect } from '@playwright/test';

test('Login Debug with New Credentials', async ({ page }) => {
  console.log('🔄 Starting login debug with new credentials...');
  
  // Listen for page close events
  page.on('close', () => {
    console.log('❌ Page was closed');
  });
  
  // Listen for navigation events
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log(`🔄 Navigation to: ${frame.url()}`);
    }
  });
  
  // Listen for network requests
  const requests = [];
  page.on('request', request => {
    const requestData = {
      url: request.url(),
      method: request.method()
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
  
  try {
    // Navigate to the page
    console.log('📍 Navigating to login page...');
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
    console.log('🔑 Filling credentials...');
    await emailField.fill('rose.gomez@jourrapide.com');
    await passwordField.fill('Pass@123');
    
    console.log('✅ Credentials filled');
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'before-login-click.png' });
    
    // Click login button
    console.log('🖱️ Clicking login button...');
    await loginButton.click();
    
    console.log('✅ Login button clicked');
    
    // Wait a moment and check what happens
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(3000);
    
    // Check if page is still accessible
    try {
      const currentUrl = page.url();
      console.log(`📍 Current URL after login: ${currentUrl}`);
      
      // Check if we're still on login page
      const stillOnLoginPage = await emailField.isVisible();
      console.log(`📍 Still on login page: ${stillOnLoginPage}`);
      
      if (!stillOnLoginPage) {
        console.log('✅ Successfully navigated away from login page');
        
        // Take screenshot after successful navigation
        await page.screenshot({ path: 'after-login-success.png' });
        
        // Check what's on the new page
        const pageContent = await page.content();
        console.log('🔍 Page content includes:');
        if (pageContent.includes('Dashboard')) console.log('  - Dashboard');
        if (pageContent.includes('Settings')) console.log('  - Settings');
        if (pageContent.includes('Create')) console.log('  - Create');
        if (pageContent.includes('Welcome')) console.log('  - Welcome');
        if (pageContent.includes('Home')) console.log('  - Home');
        if (pageContent.includes('Provider')) console.log('  - Provider');
      } else {
        console.log('⚠️ Still on login page - checking for errors');
        
        // Check for error messages
        const errorMessages = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').count();
        console.log(`📍 Error messages found: ${errorMessages}`);
        
        if (errorMessages > 0) {
          const errorText = await page.locator('text=error, text=Error, text=invalid, text=Invalid, text=failed, text=Failed, text=not found, text=User not found').first().textContent();
          console.log(`📍 Error message: ${errorText}`);
        }
        
        // Take screenshot of error state
        await page.screenshot({ path: 'login-error.png' });
      }
    } catch (error) {
      console.log('❌ Error checking page state:', error.message);
      
      // Take screenshot of error state
      try {
        await page.screenshot({ path: 'page-error.png' });
      } catch (screenshotError) {
        console.log('❌ Could not take screenshot:', screenshotError.message);
      }
    }
    
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
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    
    // Take screenshot of error state
    try {
      await page.screenshot({ path: 'test-error.png' });
    } catch (screenshotError) {
      console.log('❌ Could not take screenshot:', screenshotError.message);
    }
  }
  
  console.log('✅ Login debug test completed');
}); 
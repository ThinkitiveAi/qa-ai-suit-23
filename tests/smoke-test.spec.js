import { test, expect } from '@playwright/test';

test('Smoke Test - Basic Page Load', async ({ page }) => {
  console.log('🔄 Running smoke test...');
  
  // Test basic page load
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if we can see the login form
  const emailField = page.getByRole('textbox', { name: 'Email' });
  const passwordField = page.getByRole('textbox', { name: '*********' });
  const loginButton = page.getByRole('button', { name: "Let's get Started" });
  
  await expect(emailField).toBeVisible({ timeout: 10000 });
  await expect(passwordField).toBeVisible({ timeout: 10000 });
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  
  console.log('✅ Smoke test passed - login form is visible');
}); 
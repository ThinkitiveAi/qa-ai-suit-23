import { test, expect } from '@playwright/test';

// =========================
// Name Data
// =========================
const firstNameStarts = ['Ra', 'Sa', 'An', 'Ki', 'Ni', 'De', 'Pr', 'Vi', 'Me', 'Sh'];
const firstNameEnds   = ['hul', 'shi', 'ta', 'ran', 'jay', 'sha', 'na', 'ket', 'deep', 'a'];

const lastNameStarts = ['Sha', 'Pa', 'Me', 'Sin', 'Ver', 'Red', 'Gu', 'Ag', 'Ba', 'Cho'];
const lastNameEnds   = ['rma', 'tel', 'hta', 'gh', 'ma', 'dy', 'pta', 'wal', 'dra', 'udh'];

// =========================
// Utility Functions
// =========================
function randomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < 8; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${name}${Math.floor(Math.random() * 10000)}@thinkitive.com`;
}

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function generateFirstName() {
  return getRandomFrom(firstNameStarts) + getRandomFrom(firstNameEnds);
}
function generateLastName() {
  return getRandomFrom(lastNameStarts) + getRandomFrom(lastNameEnds);
}

// =========================
// Auth Helpers
// =========================
async function login(page) {
  console.log('Navigating to login page');
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByPlaceholder('Email').fill('RubyVOlague@jourrapide.com');
  await page.locator('input[type="password"]').fill('Pass@123');
  await page.getByRole('button', { name: "Let's get Started" }).click();
  console.log('Logged in successfully');
}

async function logout(page) {
  console.log('Logging out');
  await page.getByRole('img', { name: 'admin image' }).click();
  await page.getByText('Log Out').click();
  await page.getByRole('button', { name: 'Yes,Sure' }).click();
  console.log('Logged out successfully');
}

// =========================
// Test 1: Add Provider
// =========================
test('Add Provider User', async ({ page }) => {
  console.log('Starting adding provider');
  await login(page);

  await page.locator('a:has-text("Settings"), button:has-text("Settings"), [data-testid*="settings"]').first().click();
  await page.getByText('User Settings', { exact: true }).click();
  await page.getByText('Providers', { exact: true }).click();
  console.log('✅ Successfully navigated to Providers section');

  await page.getByRole('button', { name: 'Add Provider User' }).click();
  console.log('✅ Add Provider form opened');

  const firstName = generateFirstName();
  const lastName = generateLastName();

  console.log(`Generated Name: ${firstName} ${lastName}`);
  await page.locator('input[name="firstName"]').fill(firstName);
  await page.locator('input[name="lastName"]').fill(lastName);
  console.log('✅ Provider name is entered');

  await page.locator('input[name="role"][role="combobox"]').click();
  await page.getByText('Provider', { exact: true }).click();
  console.log('✅ Provider role selected');

  await page.locator('input[name="gender"][role="combobox"]').click();
  await page.getByText('Male', { exact: true }).click();
  console.log('✅ Gender selected: Male');

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mailinator.com`;
  await page.locator('input[name="email"]').fill(email);
  console.log(`✅ Email entered: ${email}`);

  const saveButton = page.locator('button:has-text("Save")');
  await expect(saveButton).toBeVisible();
  await saveButton.click();
  console.log('✅ Save button clicked successfully');

  // =========================
  // Availability
  // =========================
  console.log('Starting to add providers availability');
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
  console.log('✅ Navigated to Availability section');
  await page.getByRole('button', { name: 'Edit Availability' }).click();

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const fullName = `${firstName} ${lastName}`;

  await page.getByRole('combobox', { name: 'Select Provider' }).click();
  await page.getByRole('combobox', { name: 'Select Provider' }).fill(fullName);
  const providerOption = page.locator(`text="${fullName}"`);
  await expect(providerOption).toBeVisible();
  await providerOption.click();
  console.log("✅ Provider selected for availability");

  const randomWeekday = getRandomFrom(weekdays);
  await page.getByText(randomWeekday, { exact: true }).click();
  console.log(`✅ Selected day: ${randomWeekday}`);

  // Continue with the rest of your test steps here...
});
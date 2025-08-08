// =========================
// Test 2: Patient Registration

import { test, expect } from '@playwright/test';

test('Add New Patient and Schedule Appointment', async ({ page }) => {

  // Utility functions for random name generation
  const firstNameStarts = ['Jo', 'Ma', 'Sa', 'An', 'Vi'];
  const firstNameEnds = ['hn', 'ry', 'ra', 'ta', 'sh'];

  function getRandomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateClientFirstName() {
    return getRandomFrom(firstNameStarts) + getRandomFrom(firstNameEnds);
  }

  function generateClientLastName() {
    return getRandomFrom(firstNameStarts) + getRandomFrom(firstNameEnds);
  }

  // Start patient registration
  console.log('Starting patient registration test');
  await page.waitForTimeout(500);
  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
  console.log('✅ Clicked Create');

  await page.getByRole('menuitem', { name: 'New Patient' }).click();
  console.log('✅ Selected New Patient');

  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).click();
  console.log('✅ Selected Enter Patient Details');

  await page.getByRole('button', { name: 'Next' }).click();
  console.log('✅ Proceeded to patient details form');

  const clientfirstName = generateClientFirstName();
  const clientlastName = generateClientLastName();
  console.log(`✅ Generated Client Name: ${clientfirstName} ${clientlastName}`);

  await page.getByRole('textbox', { name: 'First Name *' }).fill(clientfirstName);
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(clientlastName);
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill('01-01-1999');

  await page.getByRole('combobox', { name: 'Gender' }).click();
  const randomgender = await page.locator('li[role="option"]').all();
  const randomgenderoption = Math.floor(Math.random() * randomgender.length);
  await randomgender[randomgenderoption].click();
  console.log("✅ Selected gender");

  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('9876544400');
  const clientemail = `${clientfirstName.toLowerCase()}.${clientlastName.toLowerCase()}@mailinator.com`;
  await page.locator('input[name="email"], input[type="email"]').fill(clientemail);
  console.log(`✅ Email entered: ${clientemail}`);

  await page.getByRole('button', { name: 'Save' }).click();
  console.log('✅ Clicked Save');
  await page.waitForURL('**/patients');
  await expect(page.getByRole('tab', { name: 'Patients', selected: true })).toBeVisible();
  console.log('✅ Verified navigation to patients page');

  // Appointment booking
  console.log('Starting to add Appointment');
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Appointments').click();
  console.log('✅ Successfully navigated to Appointment section');

  await page.getByRole('button', { name: 'Schedule Appointment' }).click();
  console.log('✅ Schedule Appointment clicked');

  await page.getByRole('menuitem', { name: 'New Appointment' }).click();

  const clientfullName = `${clientfirstName} ${clientlastName}`;
  await page.getByRole('combobox', { name: 'Patient Name' }).click();
  await page.getByRole('combobox', { name: 'Patient Name' }).fill(clientfullName);

  const clientOption = page.getByText(clientfullName);
  await expect(clientOption).toBeVisible({ timeout: 5000 });
  await clientOption.click();
  console.log(`✅ Patient for appointment selected: ${clientfullName}`);

  const appointmentTypeText = 'Consultation'; // <-- set this to actual appointment type
  await page.getByRole('combobox', { name: 'Appointment Type' }).click();
  await page.getByRole('option', { name: appointmentTypeText }).click();
  console.log(`✅ Selected appointment type: ${appointmentTypeText}`);

  await page.getByPlaceholder('Reason').fill('Fever');
  console.log('✅ Filled reason for visit');

  await page.getByRole('combobox', { name: 'Timezone' }).click();
  await page.getByRole('combobox', { name: 'Timezone' }).fill("Indian Standard Time (GMT +05:30)");
  await page.locator('text=Indian Standard Time (GMT +05:30)').click();
  console.log("✅ Selected timezone");

  await page.getByRole('button', { name: 'Telehealth' }).click();

  const providerfullName = 'Dr John Smith'; // <-- set this dynamically if needed
  await page.getByRole('combobox', { name: 'Provider' }).click();
  await page.getByRole('combobox', { name: 'Provider' }).fill(providerfullName);
  const providerOptions = page.getByText(providerfullName);
  await expect(providerOptions).toBeVisible({ timeout: 5000 });
  await providerOptions.click();
  console.log("✅ Provider selected successfully");

  await page.locator('button:has-text("View availability")').click();

  // Slot finding loop
  const currentDate = new Date();
  let slotFound = false;
  let attemptCount = 0;
  const maxAttempts = 20;

  while (!slotFound && attemptCount < maxAttempts) {
    attemptCount++;
    console.log(`Attempt ${attemptCount}: Checking for available slots...`);

    try {
      const targetDate = new Date(currentDate);
      targetDate.setDate(currentDate.getDate() + attemptCount - 1);
      const targetDay = targetDate.getDate().toString();
      console.log(`Looking for date: ${targetDay}`);

      await page.waitForTimeout(500);
      const calendarContainer = page.locator('div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-6.css-1ytf872');
      const dateCell = calendarContainer.locator(
        'button.MuiPickersDay-root:not(.Mui-disabled):not(.MuiPickersDay-hidden)'
      ).filter({ hasText: targetDay });

      if (await dateCell.count() > 0) {
        await dateCell.first().click();
        console.log(`Clicked on date: ${targetDay}`);
        await page.waitForTimeout(2000);

        if (await page.locator('text=No Slots Available').count() === 0) {
          const timeSlots = page.locator('[data-testid="time-slot"], .time-slot, button:has-text("AM"), button:has-text("PM")');
          if (await timeSlots.count() > 0) {
            console.log(`Found ${await timeSlots.count()} available slots for date ${targetDay}`);
            await timeSlots.first().click();
            slotFound = true;
            break;
          } else {
            console.log(`No time slots found for date ${targetDay}`);
          }
        } else {
          console.log(`No slots available for date ${targetDay}`);
        }
      } else {
        console.log(`Date ${targetDay} not found or not clickable`);
      }
    } catch (error) {
      console.log(`Error on attempt ${attemptCount}: ${error.message}`);
    }
  }

  if (!slotFound) {
    throw new Error('No available slots found within the search period');
  }

  console.log('✅ Successfully found and selected an available slot!');
  await page.screenshot({ path: 'appointment_booked.png' });

  await page.getByRole('button', { name: 'Save And Close' }).click();
  await page.waitForTimeout(2000);
  console.log('✅ Appointment saved successfully');
});
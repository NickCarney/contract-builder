import { chromium } from "playwright";
import { NextResponse } from "next/server";

// Playwright script
export async function GET() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://portal.themlc.com/sign-up");

  // Enter credentials  
  await page.locator("#CybotCookiebotDialogBodyButtonDecline").click()
  await page.fill('input[name="firstName"]', 'Nick');
  await page.fill('input[name="lastName"]', 'Carney');
  await page.fill('input[name="birthday"]', 'December 17 2001');
  await page.mouse.click(100, 150);
  await page.fill('input[name="address.streetAddress"]', '3302 Woodbine street');
  await page.fill('input[name="address.city"]', 'Chevy Chase');
  await page.fill('input[name="address.postalCode"]', '20815');

  const countryDropdown = page.locator('.react-select__control').nth(0);
  await countryDropdown.click();
  await page.locator('.react-select__menu').locator('.react-select__option', { hasText: 'United States' }).click();

  const stateDropdown = page.locator('.react-select__control').nth(1);
  await stateDropdown.click();
  await page.locator('.react-select__menu').locator('.react-select__option', { hasText: 'Maryland' }).click();

  const phoneDropdown = page.locator('.react-select__control').nth(2);
  await phoneDropdown.click();
  await page.locator('.react-select__menu').locator('.react-select__option', { hasText: 'US, CA +1' }).click();

  await page.fill('input[name="phoneNumber.phoneAreaCode"]', '817');
  await page.fill('input[name="phoneNumber.phoneNumber"]', '3130355');
  await page.fill('input[name="email"]', 'nick@mesawallet.io');

  const checkbox = page.locator('[data-testid="checkbox-component-emailCommunications"]');
  const isChecked = await checkbox.getAttribute('aria-checked');
    if (isChecked === 'true') {
        await checkbox.click();
    }

  await page.click('input[type="submit"]');


  //await browser.close();
  return NextResponse.json({ success: true });
}

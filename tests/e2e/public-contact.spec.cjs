const {test, expect} = require('@playwright/test');
const {installPublicFixture, assertNoHorizontalOverflow} = require('./public-fixture.cjs');

test('PM-024/PM-023: public search reaches guest draft and auth gate without sending', async ({page}) => {
  const fixture = await installPublicFixture(page);
  await page.goto('/search.html');
  await page.locator('select[name="country"]').selectOption('ES');
  await page.locator('select[name="city"]').selectOption('Barcelona');
  await page.locator('input[name="from"]').fill('2026-11-10');
  await page.locator('input[name="to"]').fill('2026-11-17');
  await page.locator('#availability-form button[type="submit"]').click();
  const card = page.locator('.availability-card');
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Fixture apartment');
  await expect(card).toContainText('Barcelona');
  const link = card.locator('.message-property-link');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', new RegExp(`property=${fixture.propertyId}.*from=2026-11-10.*to=2026-11-17`));
  await assertNoHorizontalOverflow(page);
  await link.click();
  await expect(page).toHaveURL(new RegExp(`/messages.html\\?property=${fixture.propertyId}`));
  await expect(page.locator('#msg-property')).toHaveText('Fixture apartment');
  await expect(page.locator('#msg-compose')).toBeVisible();
  await page.locator('#msg-dates').evaluate(node => node.open = true);
  await expect(page.locator('#msg-compose input[name="from"]')).toHaveValue('2026-11-10');
  await expect(page.locator('#msg-compose input[name="to"]')).toHaveValue('2026-11-17');
  await page.locator('#msg-compose textarea[name="body"]').fill('Is this fixture available?');
  await page.locator('#msg-send').click();
  await expect(page.locator('#msg-auth')).toBeVisible();
  await expect(page.locator('#msg-compose textarea[name="body"]')).toHaveValue('Is this fixture available?');
  expect(fixture.seen.every(call => call.method === 'GET')).toBe(true);
  await assertNoHorizontalOverflow(page);
});

test('PM-026/PM-023: Messages has one keyboard reachable link and language switch', async ({page}) => {
  const fixture = await installPublicFixture(page);
  await page.goto('/search.html');
  await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveCount(1);
  await page.locator('nav.housing-tabs a.messaging-nav-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/messages.html$/);
  await expect(page.locator('#msg-auth')).toBeVisible();
  await page.locator('[data-msg-lang="ru"]').click();
  await expect(page.locator('#msg-find-housing')).toHaveText('Найти жильё');
  await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveCount(1);
  expect(fixture.seen.every(call => call.method === 'GET')).toBe(true);
  await assertNoHorizontalOverflow(page);
});

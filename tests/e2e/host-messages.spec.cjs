const {test, expect} = require('@playwright/test');
const {installHostFixture, assertNoHorizontalOverflow} = require('./public-fixture.cjs');

test('PM-026/PM-020: signed-in Host has one keyboard reachable Messages link and returns to Host', async ({page}) => {
  const fixture = await installHostFixture(page);
  await page.goto('/host.html');
  await expect(page.locator('#host-account-session')).toBeVisible();
  const nav = page.locator('nav.housing-tabs');
  await expect(nav.locator('a.messaging-nav-link')).toHaveCount(1);
  await expect(nav.locator('a.housing-host-link')).toHaveCount(1);
  await nav.locator('a.messaging-nav-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/messages.html$/);
  await expect(page.locator('#msg-account-name')).toHaveText('fixture-owner');
  await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveCount(1);
  await page.locator('#msg-host-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/host.html$/);
  await expect(page.locator('#host-account-session')).toBeVisible();
  expect(fixture.seen.every(call => call.method === 'GET')).toBe(true);
  await assertNoHorizontalOverflow(page);
});

test('PM-026/PM-028: Host and Messages navigation uses four languages on compact viewport', async ({page}) => {
  await installHostFixture(page);
  await page.goto('/host.html');
  await expect(page.locator('#host-account-session')).toBeVisible();
  for (const [lang,host,messages] of [
    ['en','For hosts','Messages'],['es','Para propietarios','Mensajes'],
    ['ca','Per a propietaris','Missatges'],['ru','Владельцам','Сообщения']
  ]) {
    await page.locator(`[data-host-lang="${lang}"]`).click();
    await expect(page.locator('nav.housing-tabs a.housing-host-link')).toHaveText(host);
    await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveText(messages);
    await assertNoHorizontalOverflow(page);
  }
  await page.locator('nav.housing-tabs a.messaging-nav-link').click();
  for (const [lang,host,messages] of [
    ['en','For hosts','Messages'],['es','Para propietarios','Mensajes'],
    ['ca','Per a propietaris','Missatges'],['ru','Владельцам','Сообщения']
  ]) {
    await page.locator(`[data-msg-lang="${lang}"]`).click();
    await expect(page.locator('#msg-host-link')).toHaveText(host);
    await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveText(messages);
    await expect(page.locator('nav.housing-tabs a.messaging-nav-link')).toHaveCount(1);
    await assertNoHorizontalOverflow(page);
  }
});

const {expect} = require('@playwright/test');

const propertyId = '11111111-1111-4111-8111-111111111111';
const property = {
  propertyId, propertyTitle:'Fixture apartment', city:'Barcelona', ownerDisplayName:'Fixture host',
  accommodationType:'entire_place', bedrooms:1, sleeps:2,
  availableFrom:'2026-11-10', availableTo:'2026-11-17', links:[]
};

async function installPublicFixture(page) {
  const seen = [];
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({contentType:'text/css', body:''}));
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('**/api/**', route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname;
    seen.push({path, method:request.method()});
    const data = path === '/api/host/auth/me' ? {error:'unauthorized'}
      : path === '/api/locations/countries' ? [{code:'ES', name:'Spain'}]
      : path === '/api/locations/cities' && url.searchParams.get('country') === 'ES' ? [{name:'Barcelona'}]
      : path === '/api/search' && url.searchParams.get('country') === 'ES'
          && url.searchParams.get('city') === 'Barcelona'
          && url.searchParams.get('from') === property.availableFrom
          && url.searchParams.get('to') === property.availableTo ? [property]
      : path === `/api/messaging/contact-options/${propertyId}` ? {
          propertyId, propertyTitle:property.propertyTitle, hostDisplayName:property.ownerDisplayName,
          hostProfileId:'fixture-host', acceptingNewConversations:true
        }
      : null;
    if (path === '/api/host/auth/me') return route.fulfill({status:401, json:data});
    if (!data || request.method() !== 'GET') return route.fulfill({status:501, json:{error:`Unexpected fixture request: ${request.method()} ${path}`}});
    return route.fulfill({json:data});
  });
  return {seen, propertyId};
}

async function assertNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({width:document.documentElement.clientWidth, scrollWidth:document.documentElement.scrollWidth}));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
}

module.exports = {installPublicFixture, assertNoHorizontalOverflow};

import { test, expect } from '@playwright/test';

test('a refreshed image URL recovers a failed photo for the same article', async ({ page }) => {
  const articleUrl = 'https://publisher.example/local-transport';
  let imageUrl = 'https://images.example/broken.svg';
  let brokenRequests = 0;
  await page.route('https://raw.githubusercontent.com/**', (route) =>
    route.fulfill({
      json: route.request().url().endsWith('/data/status.json')
        ? { status: 'ok', feeds: [] }
        : {
            articles: [
              {
                title: 'Local transport timetable updated',
                url: articleUrl,
                urlToImage: imageUrl,
                source: { name: 'Fixture Gazette' },
              },
            ],
          },
    }),
  );
  await page.route('https://images.example/**', (route) => {
    if (route.request().url().endsWith('/broken.svg')) {
      brokenRequests++;
      return route.abort();
    }
    return route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="green"/></svg>',
    });
  });

  await page.goto('/');
  const card = page.locator('.article-lead');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('.photo-fallback')).toBeVisible();
  expect(brokenRequests).toBe(1);

  const refresh = page.getByRole('button', { name: 'Refresh news', exact: true });
  await Promise.all([page.waitForResponse('**/in/general.json'), refresh.click()]);
  await expect(refresh).toBeEnabled();
  await expect(card.locator('.photo-fallback')).toBeVisible();
  expect(brokenRequests).toBe(1);

  imageUrl = 'https://images.example/corrected.svg';
  await refresh.click();
  await expect(card.locator('.article-photo img')).toHaveAttribute('src', imageUrl);
  await expect(card.locator('.article-photo img')).toBeVisible();
  await expect
    .poll(() =>
      card.locator('.article-photo img').evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBe(10);
  await expect(card.locator('.photo-fallback')).toHaveCount(0);
  await expect(card.locator('.article-link')).toHaveAttribute('href', articleUrl);
  await expect(card.getByRole('heading')).toHaveText('Local transport timetable updated');
});

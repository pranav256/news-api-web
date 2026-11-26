import { test, expect } from '@playwright/test';
import { CATEGORIES, COUNTRIES } from '../lib/news';

test.beforeEach(async ({ context }) => {
  await context.route('https://raw.githubusercontent.com/**', (route) => {
    const parts = new URL(route.request().url()).pathname.split('/');
    const country = parts.at(-2);
    const category = parts.at(-1)!.replace(/(?:_headlines)?\.json$/, '');
    return route.fulfill({
      json:
        category === 'status'
          ? {
              status: 'ok',
              feeds: COUNTRIES.flatMap(({ code }) =>
                CATEGORIES.map((category) => ({
                  country: code,
                  category,
                  status: 'updated',
                  articles_count: 12,
                })),
              ),
            }
          : {
              country,
              category,
              articles: Array.from({ length: 12 }, (_, index) => ({
                title: `Regional report ${index + 1}`,
                description: 'A local transport update from the fixture edition.',
                url: `https://publisher.example/${country}/${category}/${index + 1}`,
                source: { name: 'Fixture Gazette' },
              })),
            },
    });
  });
});

test('feed selections, code, response inspection and reading remain synchronized', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.article-card')).toHaveCount(6);
  for (const width of [390, 1440, 1728]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.getByRole('button', { name: 'More stories', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(12);
  await page.getByRole('searchbox').fill('zzqqxx-no-match');
  await expect(page.getByRole('heading', { name: 'No matching stories' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).first().click();
  await page.getByRole('combobox', { name: 'API country' }).selectOption('us');
  await page.getByRole('combobox', { name: 'API section' }).selectOption('business');
  await page.getByRole('button', { name: 'With metadata', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(6);
  await expect(page.locator('.endpoint-address > a')).toHaveAttribute(
    'href',
    /data\/us\/business_headlines.json$/,
  );
  for (const language of ['cURL', 'JavaScript', 'Python', 'Go']) {
    await page.getByRole('tab', { name: language, exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: language, exact: true })).toContainText(
      'data/us/business_headlines.json',
    );
    await page.getByRole('button', { name: 'Copy code', exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      'data/us/business_headlines.json',
    );
  }
  await page.getByRole('tab', { name: 'JSON response', exact: true }).click();
  await page.getByRole('button', { name: 'Copy JSON', exact: true }).click();
  const preview = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
  expect(preview.country).toBe('us');
  expect(preview.category).toBe('business');
  expect(preview.articles).toHaveLength(1);
  await page
    .getByRole('group', { name: 'Feed health region' })
    .getByRole('button', { name: 'All regions', exact: true })
    .click();
  await expect(page.locator('.feed-select')).toHaveCount(35);
  await page
    .locator('.feed-select')
    .filter({ hasText: /US\s*Technology/ })
    .click();
  await expect(page.locator('.feed-detail h3')).toHaveText('Technology');
  await page.getByRole('button', { name: 'Read this feed', exact: true }).click();
  await expect(page.locator('.endpoint-address > a')).toHaveAttribute(
    'href',
    /data\/us\/technology_headlines.json$/,
  );
  expect(errors).toEqual([]);
});

test('theme, keyboard navigation and a failed refresh preserve usable content', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.article-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.setViewportSize({ width: 320, height: 1000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect(await page.evaluate(() => document.activeElement?.closest('nav')?.id)).toBe(
    'primary-navigation',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  await expect(page.locator('.article-card')).toHaveCount(6);
  const url = await page.locator('.endpoint-address > a').getAttribute('href');
  await page.route(url!, (route) => route.abort());
  await page.getByRole('button', { name: 'Refresh news', exact: true }).click();
  await expect(page.locator('#reader .inline-error')).toContainText(
    'Showing the last loaded edition.',
  );
  await expect(page.locator('.article-card')).toHaveCount(6);
  await page.unroute(url!);
  await page.locator('#reader').getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('#reader .inline-error')).toHaveCount(0);
});

test('a blocked connection shows actionable errors without fabricated stories', async ({
  page,
}) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('#reader .inline-error')).toBeVisible();
  await expect(page.locator('#status .inline-error')).toBeVisible();
  await expect(page.locator('.article-card')).toHaveCount(0);
  await expect(page.locator('.reader-loading')).toHaveCount(0);
});

test('loading placeholders preserve the reading layout at mobile and desktop widths', async ({
  context,
}) => {
  for (const width of [390, 1440]) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 1000 });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('https://raw.githubusercontent.com/**/in/general.json', async (route) => {
      await gate;
      await route.fallback();
    });
    await page.goto('http://127.0.0.1:3102');
    await expect(page.locator('.reader-loading')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const before = await page
      .locator('#reader .reader-bottom')
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top -
          document.querySelector('#reader .reader-content')!.getBoundingClientRect().top,
      );
    release();
    await expect(page.locator('.article-card')).toHaveCount(6);
    const after = await page
      .locator('#reader .reader-bottom')
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top -
          document.querySelector('#reader .reader-content')!.getBoundingClientRect().top,
      );
    expect(Math.abs(after - before)).toBeLessThan(1);
    await page.close();
  }
});

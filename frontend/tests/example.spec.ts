import { test, expect } from '@playwright/test';

test('homepage has h4 tag with text "Welcome to the Blog!"', async ({ page }) => {

    await page.goto('http://localhost:3000');

    const h4Tag = page.locator('h4');
    await expect(h4Tag).toHaveText('Welcome to the Blog!');
});
import { expect, type Page, test } from '@playwright/test';

const uniqueEmail = () =>
  `user_${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`;

async function registerUser(page: Page) {
  const email = uniqueEmail();
  const password = '123456';
  const name = 'Playwright User';

  await page.goto('/register');

  await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();

  await page.getByLabel(/name/i).fill(name);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole('button', { name: /^register$/i }).click();

  return { email, password, name };
}

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole('button', { name: /^login$/i }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(/hello,/i)).toBeVisible();
}

async function openProfileFromHeader(page: Page) {
  const profileButton = page.getByRole('button', { name: /^profile$/i });

  await expect(profileButton).toBeVisible();
  await profileButton.click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(
    page.getByRole('heading', { name: /my profile/i }),
  ).toBeVisible();
}

async function createArticleFromProfile(
  page: Page,
  articleTitle: string,
  articleContent: string,
) {
  await expect(
    page.getByRole('heading', { name: /create article/i }),
  ).toBeVisible();

  await page.getByLabel(/^title$/i).fill(articleTitle);
  await page.getByLabel(/^content$/i).fill(articleContent);

  await page.getByRole('button', { name: /create article/i }).click();

  await expect(page.getByText(/article created successfully/i)).toBeVisible();

  await expect(page.getByText(articleTitle)).toBeVisible();
}

async function findArticleCardByTitle(page: Page, articleTitle: string) {
  const articleHeading = page
    .getByRole('heading', { name: articleTitle })
    .first();
  await expect(articleHeading).toBeVisible();

  return articleHeading.locator(
    'xpath=ancestor::*[self::div or self::article][1]',
  );
}

test.describe('Blog platform user scenarios', () => {
  test('GET /api/actuator returns OK', async ({ request }) => {
    const response = await request.get('/api/actuator');

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toBe('OK');
  });

  test('guest opens home page and navigates to login', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /welcome to the blog/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /latest articles/i }),
    ).toBeVisible();

    await page.getByRole('button', { name: /go to login/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('guest cannot access profile page', async ({ page }) => {
    await page.goto('/profile');

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
    await expect(
      page.getByText(/you are not authorized\. please log in first/i),
    ).toBeVisible();
  });

  test('user can register through register page', async ({ page }) => {
    await registerUser(page);

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('registered user can log in and see authorized state on home page', async ({
    page,
  }) => {
    const user = await registerUser(page);
    await loginUser(page, user.email, user.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/hello,/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /latest articles/i }),
    ).toBeVisible();
  });

  test('authorized user can create article from profile page', async ({
    page,
  }) => {
    const user = await registerUser(page);
    await loginUser(page, user.email, user.password);
    await openProfileFromHeader(page);

    const articleTitle = `Playwright article ${Date.now()}`;
    const articleContent =
      'This article was created by Playwright scenario test.';

    await createArticleFromProfile(page, articleTitle, articleContent);

    await expect(page.getByText(articleTitle)).toBeVisible();
  });

  test('authorized user can add comment to own article from profile page', async ({
    page,
  }) => {
    const user = await registerUser(page);
    await loginUser(page, user.email, user.password);
    await openProfileFromHeader(page);

    const articleTitle = `Playwright comment article ${Date.now()}`;
    const articleContent = 'Article for comment scenario';

    await createArticleFromProfile(page, articleTitle, articleContent);

    const articleCard = await findArticleCardByTitle(page, articleTitle);

    const commentText = `Playwright comment ${Date.now()}`;

    const commentInput = articleCard.getByLabel(/write a comment/i).first();
    await expect(commentInput).toBeVisible();
    await commentInput.fill(commentText);

    await articleCard
      .getByRole('button', { name: /add comment/i })
      .first()
      .click();

    await expect(articleCard.getByText(commentText)).toBeVisible();
  });
});

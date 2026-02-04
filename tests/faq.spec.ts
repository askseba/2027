import { test, expect } from '@playwright/test'

test('FAQ accordion works', async ({ page }) => {
  await page.goto('/faq')
  await expect(page.locator('h1')).toHaveText('الأسئلة الشائعة')

  // اختبر accordion
  await page.click('[data-testid="q1"]')
  await expect(page.locator('[data-testid="answer1"]')).toBeVisible()

  // single expand only
  await page.click('[data-testid="q2"]')
  await expect(page.locator('[data-testid="answer1"]')).not.toBeVisible()
})

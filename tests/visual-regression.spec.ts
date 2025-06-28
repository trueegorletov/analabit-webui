import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for WebUI
 *
 * These tests verify that the visual appearance of our main pages
 * remains consistent across different viewports and browsers.
 *
 * Diff threshold: ≤ 0.1% as specified in Step 8 of the global refactor plan
 */

test.describe('Visual Regression Tests', () => {
  test.describe('Home Page', () => {
    test('should match visual baseline - Desktop', async ({ page }) => {
      await page.goto('/');

      // Wait for animations and content to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Extra wait for any CSS animations

      await expect(page).toHaveScreenshot('home-desktop.png');
    });

    test('should match visual baseline - Tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('home-tablet.png');
    });

    test('should match visual baseline - Mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('home-mobile.png');
    });
  });

  test.describe('Dashboard Page', () => {
    test('should match visual baseline - Desktop', async ({ page }) => {
      await page.goto('/directions/demo');

      // Wait for data to load and animations to settle
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500); // Extra wait for dashboard data rendering

      await expect(page).toHaveScreenshot('dashboard-desktop.png');
    });

    test('should match visual baseline - Tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/directions/demo');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      await expect(page).toHaveScreenshot('dashboard-tablet.png');
    });

    test('should match visual baseline - Mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/directions/demo');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      await expect(page).toHaveScreenshot('dashboard-mobile.png');
    });
  });

  test.describe('Component Visual Tests', () => {
    test('Header component should remain consistent', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test header specifically
      const header = page.locator('header[role="banner"]');
      await expect(header).toHaveScreenshot('header-component.png');
    });

    test('AnimatedBlob should render correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Wait for blob animation to stabilize

      // Test animated blob specifically
      const blob = page.locator('.animated-blob').first();
      if ((await blob.count()) > 0) {
        await expect(blob).toHaveScreenshot('animated-blob.png');
      }
    });
  });

  test.describe('Responsive Layout Tests', () => {
    const viewports = [
      { name: 'large-desktop', width: 1920, height: 1080 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'mobile-small', width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      test(`Home page layout at ${viewport.name} (${viewport.width}×${viewport.height})`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot(`home-${viewport.name}.png`);
      });
    }
  });
});

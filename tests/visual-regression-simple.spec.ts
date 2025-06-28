import { test, expect } from '@playwright/test';

/**
 * Simplified Visual Regression Tests for Baseline Generation
 *
 * These tests are designed to generate stable baseline screenshots
 * by handling animated content appropriately.
 */

// Increase timeout for screenshot generation
test.setTimeout(30000);

test.describe('Simplified Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations globally to ensure stable screenshots
    await page.addInitScript(`
      window.__DISABLE_ANIMATIONS__ = true;
      // Disable CSS animations and transitions
      const style = document.createElement('style');
      style.textContent = \`
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-delay: 0ms !important;
          transition-duration: 0.001ms !important;
          transition-delay: 0ms !important;
        }
      \`;
      document.head.appendChild(style);
    `);
  });

  test.describe('Home Page Baselines', () => {
    test('Home page - Desktop (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      // Wait for content to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Take screenshot
      await expect(page).toHaveScreenshot('home-desktop-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });

    test('Home page - Tablet (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await expect(page).toHaveScreenshot('home-tablet-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });

    test('Home page - Mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await expect(page).toHaveScreenshot('home-mobile-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });
  });

  test.describe('Dashboard Page Baselines', () => {
    test('Dashboard - Desktop (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/directions/demo');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Extra time for dashboard data

      await expect(page).toHaveScreenshot('dashboard-desktop-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });

    test('Dashboard - Tablet (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/directions/demo');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      await expect(page).toHaveScreenshot('dashboard-tablet-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });

    test('Dashboard - Mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/directions/demo');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      await expect(page).toHaveScreenshot('dashboard-mobile-baseline.png', {
        fullPage: true,
        timeout: 10000,
      });
    });
  });
});

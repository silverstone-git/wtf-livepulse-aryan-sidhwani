import { test, expect } from '@playwright/test';

test.describe('WTF LivePulse Command Centre', () => {
  // Ensure a clean slate before each test runs
  test.beforeEach(async ({ page, request }) => {
    // Reset backend state for test isolation
    await request.post('http://localhost:3001/api/simulator/stop');
    await request.post('http://localhost:3001/api/simulator/reset');
    
    // Set simulator speed to 1x at the start of each test
    await request.post('http://localhost:3001/api/simulator/start', { data: { speed: 1 } });
    await request.post('http://localhost:3001/api/simulator/stop');

    // Navigate to the app
    await page.goto('/');
  });

  test('TC-01: Load Dashboard & Navigation', async ({ page }) => {
    await expect(page.getByText('WTF LIVEPULSE')).toBeVisible();
    await expect(page.getByRole('button', { name: /Bandra|Banjara|Connaught/i }).first()).toBeVisible();
  });

  test('TC-02: Gym Switching & Data Integrity', async ({ page }) => {
    const occupancyCounter = page.getByTestId('occupancy-counter');
    await expect(occupancyCounter).toBeVisible();
    
    const gymButtons = page.getByRole('button').filter({ hasText: /West|Hills|Place|Nagar/i });
    if (await gymButtons.count() > 1) {
      await gymButtons.nth(1).click();
      await expect(occupancyCounter).toBeVisible();
    }
  });

  test('TC-03: Real-time Feed Propagation', async ({ page }) => {
    await page.getByRole('button', { name: /Initiate Simulation|START/i }).click();
    await expect(page.getByRole('heading', { name: /Live Activity Feed/i })).toBeVisible();
    
    const eventMarker = page.locator('div').filter({ hasText: /CHECKIN|CHECKOUT|PAYMENT/ }).first();
    await expect(eventMarker).toBeVisible({ timeout: 20000 });
  });

  test('TC-04: Anomaly Alerting & Badge Logic', async ({ page, request }) => {
    const badge = page.locator('.animate-subtle-pulse').filter({ hasText: /^\d+$/ });
    
    // Trigger anomaly deterministically via test endpoint
    await request.post('http://localhost:3001/api/anomalies/trigger-test');
    
    // Badge should now appear instantly
    await expect(badge).toBeVisible({ timeout: 5000 });
    const text = await badge.innerText();
    expect(parseInt(text)).toBeGreaterThanOrEqual(1);
  });

  test('TC-05: Analytics & Heatmap Visibility', async ({ page }) => {
    await expect(page.getByText(/Footfall Heatmap/i)).toBeVisible();
    await expect(page.getByText(/Retention Risk Matrix/i)).toBeVisible();
    const heatmapGrid = page.locator('.grid-cols-7').first();
    await expect(heatmapGrid).toBeVisible();
  });

  test('TC-06: Operator Controls & Profile Dropdowns', async ({ page }) => {
    const settingsBtn = page.locator('button').filter({ has: page.locator('span:has-text("settings")') });
    await settingsBtn.click();
    await expect(page.getByText(/System Configuration/i)).toBeVisible();
    
    const hcToggle = page.getByText(/High Contrast/i);
    await hcToggle.click();
    await expect(page.locator('body')).toHaveClass(/high-contrast/);

    const profileBtn = page.getByTestId('profile-button');
    await profileBtn.click();
    await expect(page.getByText(/Operator Admin/i)).toBeVisible();
  });

  test('TC-07: Simulator Speed Control (Step Up/Down)', async ({ page }) => {
    const speedDisplay = page.getByTestId('speed-display');
    const stepUpBtn = page.locator('button[title="Step Up Velocity"]');
    const stepDownBtn = page.locator('button[title="Step Down Velocity"]');
    
    await expect(speedDisplay).toContainText('1X');
    
    await stepUpBtn.click();
    await expect(speedDisplay).toContainText('5X');
    await stepUpBtn.click();
    await expect(speedDisplay).toContainText('10X');
    
    await stepDownBtn.click();
    await expect(speedDisplay).toContainText('5X');
    await stepDownBtn.click();
    await expect(speedDisplay).toContainText('1X');
  });
});

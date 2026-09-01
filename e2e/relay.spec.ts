import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?demo=1')
})

test('initial state is blocked on the unowned fridge risk', async ({ page }) => {
  await expect(page.locator('.handoff-status')).toContainText('Handoff incomplete')
  await expect(page.locator('.eyebrow')).toContainText('NORTHSTAR COFFEE')
  await expect(page.getByText('The missing hour')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Draft a safe handoff' })).toBeVisible()
})

test('agent can draft a handoff, which requires manager approval', async ({ page }) => {
  await page.getByRole('button', { name: 'Draft a safe handoff' }).click()
  await expect(page.locator('.draft-card')).toContainText('REVIEW REQUIRED')
  await expect(page.locator('.draft-card')).toContainText('Maya')
  await expect(page.locator('.handoff-status')).toContainText('Handoff incomplete')
})

test('manager approval verifies the handoff and records an audit trail', async ({ page }) => {
  await page.getByRole('button', { name: 'Draft a safe handoff' }).click()
  await page.getByRole('button', { name: 'Approve this handoff' }).click()
  await expect(page.locator('.handoff-status')).toContainText('Handoff verified')
  await expect(page.locator('.confirmed-card')).toContainText('Maya')
  await expect(page.locator('.timeline')).toContainText('Approved the recovery plan')
  await expect(page.locator('.timeline')).toContainText('Nisha · Manager')
})

test('no approval bypass: readiness does not verify from a draft alone', async ({ page }) => {
  await page.getByRole('button', { name: 'Draft a safe handoff' }).click()
  await expect(page.locator('.handoff-status')).not.toContainText('verified')
})

test('can switch to a second location with its own state', async ({ page }) => {
  await page.getByRole('button', { name: /Park Street Coffee/ }).click()
  await expect(page.locator('.eyebrow')).toContainText('PARK STREET COFFEE')
  await expect(page.locator('.handoff-status')).toContainText('Handoff verified')
})

test('reset demo restores the original blocked state', async ({ page }) => {
  await page.getByRole('button', { name: 'Draft a safe handoff' }).click()
  await page.getByRole('button', { name: 'Approve this handoff' }).click()
  await expect(page.locator('.handoff-status')).toContainText('Handoff verified')

  await page.getByRole('button', { name: 'Reset demo' }).click()
  await expect(page.locator('.eyebrow')).toContainText('NORTHSTAR COFFEE')
  await expect(page.locator('.handoff-status')).toContainText('Handoff incomplete')
  await expect(page.getByRole('button', { name: 'Draft a safe handoff' })).toBeVisible()
})

test('shows the WebMCP-unavailable banner in a browser without the API', async ({ page }) => {
  await expect(page.locator('.resilience-banner.warn')).toContainText('WebMCP tools aren’t available')
})

test('command bar accepts a natural-language shortcut to draft a handoff', async ({ page }) => {
  await page.getByPlaceholder('Ask Relay to prepare a safe handoff…').fill('please prepare a safe handoff')
  await page.getByPlaceholder('Ask Relay to prepare a safe handoff…').press('Enter')
  await expect(page.locator('.draft-card')).toContainText('REVIEW REQUIRED')
  await expect(page.getByPlaceholder('Ask Relay to prepare a safe handoff…')).toHaveValue('')
})

test('ownership horizon markers select the corresponding risk', async ({ page }) => {
  await page.locator('.horizon-marker', { hasText: 'Till discrepancy' }).click()
  await expect(page.locator('.focus-panel h2')).toContainText('Till discrepancy')
})

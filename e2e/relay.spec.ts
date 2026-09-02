import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?demo=1')
})

test.describe('WebMCP tool execution (stubbed modelContext)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__tools = {}
      ;(document as any).modelContext = {
        registerTool: async (tool: any) => { (window as any).__tools[tool.name] = tool },
      }
    })
    await page.goto('/?demo=1')
    await expect(page.locator('.status-row')).toContainText('WebMCP tools connected')
  })

  test('agent reads real registered tools and can flag a risk from a note, gated on manager confirmation', async ({ page }) => {
    const notes = await page.evaluate(async () => (window as any).__tools['list_shift_notes'].execute({}))
    expect(notes.length).toBeGreaterThan(0)
    expect(notes[0]).toHaveProperty('text')

    const readiness = await page.evaluate(async () => (window as any).__tools['get_handoff_readiness'].execute({}))
    expect(readiness.status).toBe('blocked')

    const flagResult = await page.evaluate(async (noteId) => (window as any).__tools['flag_risk_from_note'].execute({
      noteId, title: 'Back door lock sticking', severity: 'medium', detail: 'Lock sticks on the back door; no locksmith called yet.',
    }), notes.find((n: any) => n.tag === 'Stock').id)
    expect(flagResult.status).toBe('candidate_created')
    expect(flagResult.requiresManagerConfirmation).toBe(true)

    // Candidate must not silently become a tracked risk or block/verify the handoff on its own.
    const readinessAfterFlag = await page.evaluate(async () => (window as any).__tools['get_handoff_readiness'].execute({}))
    expect(readinessAfterFlag.status).toBe('blocked')
    expect(readinessAfterFlag.blockingRisks).not.toContain(flagResult.riskId)

    await expect(page.locator('.new-badge')).toBeVisible()
    await page.locator('.risk-card.is-candidate').click()
    await expect(page.locator('.candidate-card')).toContainText('Flagged from a shift note')

    // No tool can silently confirm the candidate — only the visible manager action can.
    await page.getByRole('button', { name: 'Confirm as a risk' }).click()
    const auditText = await page.locator('.timeline').innerText()
    expect(auditText).toContain('Confirmed')
    expect(auditText).toContain('Nisha · Manager')
  })

  test('agent cannot flag a risk from a note that was not returned by list_shift_notes', async ({ page }) => {
    const result = await page.evaluate(async () => (window as any).__tools['flag_risk_from_note'].execute({
      noteId: 'not-a-real-note', title: 'Fabricated risk', severity: 'critical', detail: 'Should not be created.',
    }))
    expect(result.status).toBe('not_found')
  })
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

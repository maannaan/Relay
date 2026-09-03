import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const URL = 'https://relay-webmcp-openai.netlify.app'
mkdirSync('docs/screenshots', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto(URL, { waitUntil: 'networkidle' })

// Ensure clean blocked state
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.chip-button')].find((b) => b.textContent.includes('Reset'))
  btn?.click()
})
await page.waitForTimeout(300)
await page.click('.risk-card.critical')
await page.waitForTimeout(200)
await page.screenshot({ path: 'docs/screenshots/01-blocked-missing-hour.png' })
console.log('captured 01-blocked-missing-hour.png')

await page.click('button:has-text("Draft a safe handoff")')
await page.waitForTimeout(300)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(200)
await page.screenshot({ path: 'docs/screenshots/02-manager-review.png' })
console.log('captured 02-manager-review.png')

await page.click('button:has-text("Approve this handoff")')
await page.waitForTimeout(300)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(200)
await page.screenshot({ path: 'docs/screenshots/03-verified.png' })
console.log('captured 03-verified.png')

// Reset back to a clean state for the live site
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.chip-button')].find((b) => b.textContent.includes('Reset'))
  btn?.click()
})
await page.waitForTimeout(300)

await browser.close()
console.log('done')

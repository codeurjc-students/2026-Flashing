import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Builder, By, Key, type WebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

describe('Prelaunch landing system test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless=new', '--window-size=1280,900', '--force-prefers-reduced-motion');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }, 60_000);

  afterAll(async () => { await driver?.quit(); });

  it('shows the approved landing, supports its interactions and fits a mobile viewport', async () => {
    await driver.get('http://127.0.0.1:5173');
    await driver.wait(until.elementLocated(By.css('.hero-copy h1')), 10_000);
    expect(await driver.findElement(By.css('.hero-logo')).isDisplayed()).toBe(true);
    expect(await driver.findElement(By.css('.hero-copy h1')).getText()).toContain('Menos scroll.');
    expect(await driver.findElement(By.css('.hero-copy h1 .hero-life')).getText()).toBe('Más vida.');
    const flashButton = await driver.findElement(By.xpath("//button[contains(., 'Descubrir el flash')]"));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center",behavior:"instant"})', flashButton);
    await flashButton.click();
    expect(await driver.findElement(By.css('.preview-content h2')).getText()).toBe('Mira hacia arriba.');
    const storyButton = await driver.findElement(By.css('.story-next'));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center",behavior:"instant"})', storyButton);
    await storyButton.click();
    expect(await driver.findElement(By.css('.story-content h3')).getText()).toContain('Dos cámaras.');

    await driver.manage().window().setRect({ width: 768, height: 1024 });
    expect(await driver.findElement(By.css('.hero-logo')).isDisplayed()).toBe(true);
    await driver.manage().window().setRect({ width: 390, height: 844 });
    await driver.wait(async () => await driver.executeScript(`
      const slot = document.querySelector('.launch-ticket-slot');
      const ticket = document.querySelector('.tear-ticket');
      return parseFloat(ticket.style.getPropertyValue('--tt-w')) === Math.floor(slot.getBoundingClientRect().width);
    `), 10_000);
    expect(await driver.executeScript('return document.documentElement.scrollWidth <= window.innerWidth')).toBe(true);
    expect(await driver.executeScript(`return document.fonts.check('500 20px "Clash Display"')`)).toBe(true);
    expect(await driver.findElement(By.css('.hero-logo')).isDisplayed()).toBe(false);
    const layout = await driver.executeScript<{ textToCard: number; footerCentered: boolean }>(`
      const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
      const copy = rect('.hero-copy'), card = rect('.flash-preview');
      const footer = rect('.footer-inner');
      return {
        textToCard: card.top - copy.bottom,
        footerCentered: [...document.querySelector('.footer-inner').children].every((child) => {
          const bounds = child.getBoundingClientRect();
          return Math.abs(bounds.left + bounds.width / 2 - footer.left - footer.width / 2) < 1;
        }),
      };
    `);
    expect(layout.textToCard).toBeGreaterThanOrEqual(48);
    expect(layout.footerCentered).toBe(true);
    const ticketWidth = await driver.executeScript<number>('return document.querySelector(".launch-ticket-slot").clientWidth');
    await driver.wait(async () => await driver.findElement(By.css('.tear-ticket')).getAttribute('data-orientation') === (ticketWidth < 440 ? 'vertical' : 'horizontal'), 10_000);
    await driver.findElement(By.css('.tear-ticket [role="button"]')).sendKeys(Key.ENTER);
    await driver.wait(until.urlContains('/register'), 10_000);
    await driver.wait(until.elementLocated(By.css('[role="slider"]')), 10_000);
    expect(await driver.executeScript('return document.documentElement.scrollWidth <= window.innerWidth')).toBe(true);

    await driver.get('http://127.0.0.1:5173/this-page-does-not-exist');
    await driver.wait(until.elementLocated(By.css('.error-content')), 10_000);
    expect(await driver.findElements(By.css('.error-page .auth-card'))).toHaveLength(0);
  }, 20_000);
});

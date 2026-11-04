import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Builder, By, Key, type WebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const FRONTEND_URL = 'http://127.0.0.1:5173';

describe('Authentication page system test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless=new', '--window-size=1280,900', '--force-prefers-reduced-motion');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }, 60_000);

  afterAll(async () => {
    await driver?.quit();
  });

  it('logs in with the sample user and displays the prelaunch account instead of the mobile app', async () => {
    await driver.get(`${FRONTEND_URL}/login`);
    await driver.wait(until.elementLocated(By.name('email')), 10_000);
    await driver.findElement(By.name('email')).sendKeys('demo@flashing.local');
    await driver.findElement(By.name('password')).sendKeys('Demo_2026');
    const loginSlider = await driver.findElement(By.css('[role="slider"]'));
    await driver.wait(async () => await loginSlider.getAttribute('aria-disabled') !== 'true', 10_000);
    await loginSlider.sendKeys(Key.END);

    await driver.wait(until.urlContains('/welcome'), 10_000);
    await driver.wait(until.elementLocated(By.css('main h1')), 10_000);
    const pageText = await driver.findElement(By.css('main')).getText();
    expect(pageText).toContain('demo@flashing.local');
    expect(pageText).toContain('tu cuenta está creada');
    expect(pageText).toContain('Flashing está casi lista');
    expect(await driver.executeScript("return localStorage.getItem('flashing.accessToken')")).toBeNull();
    expect(await driver.executeScript("return localStorage.getItem('flashing.refreshToken')")).toBeNull();

    await driver.findElement(By.xpath("//button[normalize-space()='Cerrar sesión']")).click();
    await driver.wait(until.urlContains('/login'), 10_000);
    await driver.get(`${FRONTEND_URL}/welcome`);
    await driver.wait(until.urlContains('/login'), 10_000);
  }, 20_000);

  it('registers from the landing and keeps the launch notification choice after a reload', async () => {
    const suffix = Date.now().toString();
    await driver.get(FRONTEND_URL);
    await driver.wait(until.elementLocated(By.css('.hero-copy')), 10_000);
    await driver.findElement(By.xpath("//a[contains(., 'Quiero mi próximo flash')]" )).click();
    await driver.wait(until.elementLocated(By.name('displayName')), 10_000);
    await driver.findElement(By.name('displayName')).sendKeys('Early bird');
    await driver.findElement(By.name('username')).sendKeys(`bird${suffix}`);
    await driver.findElement(By.name('email')).sendKeys(`bird${suffix}@example.com`);
    await driver.findElement(By.name('password')).sendKeys('Password_1');
    expect(await driver.findElement(By.name('launchUpdates')).isSelected()).toBe(false);
    expect(await driver.findElements(By.css('input[type="checkbox"]'))).toHaveLength(1);
    await driver.findElement(By.name('launchUpdates')).click();
    const registerSlider = await driver.findElement(By.css('[role="slider"]'));
    await driver.wait(async () => await registerSlider.getAttribute('aria-disabled') !== 'true', 10_000);
    await registerSlider.sendKeys(Key.END);
    await driver.wait(until.urlContains('/welcome'), 10_000);
    await driver.wait(until.elementLocated(By.name('launchUpdates')), 10_000);
    expect(await driver.findElement(By.name('launchUpdates')).isSelected()).toBe(true);
    await driver.findElement(By.name('launchUpdates')).click();
    await driver.findElement(By.xpath("//button[normalize-space()='Guardar cambios']")).click();
    await driver.wait(until.elementLocated(By.css('.form-success')), 10_000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.name('launchUpdates')), 10_000);
    expect(await driver.findElement(By.name('launchUpdates')).isSelected()).toBe(false);
    await driver.findElement(By.xpath("//button[normalize-space()='Cerrar sesión']")).click();
    await driver.wait(until.urlContains('/login'), 10_000);
  }, 30_000);
});

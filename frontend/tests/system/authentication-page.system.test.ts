import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Builder, By, type WebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const FRONTEND_URL = 'http://127.0.0.1:5173';

describe('Authentication page system test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless=new', '--window-size=1280,720');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }, 60_000);

  afterAll(async () => {
    await driver?.quit();
  });

  it('logs in with the sample user and displays the profile', async () => {
    await driver.get(`${FRONTEND_URL}/login`);
    await driver.wait(until.elementLocated(By.name('email')), 10_000);
    await driver.findElement(By.name('email')).sendKeys('demo@flashing.local');
    await driver.findElement(By.name('password')).sendKeys('Demo_2026');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/profile'), 10_000);
    await driver.wait(until.elementLocated(By.xpath("//h1[normalize-space()='Mi perfil']")), 10_000);
    const pageText = await driver.findElement(By.css('main')).getText();
    expect(pageText).toContain('demo@flashing.local');
    expect(pageText).toContain('Rol: USER');
    expect(await driver.executeScript("return localStorage.getItem('flashing.accessToken')")).toBeNull();
    expect(await driver.executeScript("return localStorage.getItem('flashing.refreshToken')")).toBeNull();

    await driver.findElement(By.xpath("//button[normalize-space()='Cerrar sesión']")).click();
    await driver.wait(until.urlContains('/login'), 10_000);
    await driver.get(`${FRONTEND_URL}/profile`);
    await driver.wait(until.urlContains('/login'), 10_000);
  }, 20_000);
});

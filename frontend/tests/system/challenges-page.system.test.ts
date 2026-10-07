import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Builder, By, type WebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const FRONTEND_URL = 'http://127.0.0.1:5173';

describe('Challenges page system test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless=new', '--window-size=1280,720');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 60_000);

  afterAll(async () => {
    await driver?.quit();
  });

  it('shows the sample challenges on the main page', async () => {
    await driver.get(FRONTEND_URL);

    await driver.wait(
      until.elementLocated(By.xpath("//h3[normalize-space()='Algo azul']")),
      10_000,
    );

    const pageTitle = await driver.findElement(By.css('main h1')).getText();
    const sectionTitle = await driver.findElement(By.css('main h2')).getText();
    const challengeTitles = await Promise.all(
      (await driver.findElements(By.css('main li h3')))
        .map((element) => element.getText()),
    );
    const pageText = await driver.findElement(By.css('main')).getText();

    expect(pageTitle).toBe('Flashing');
    expect(sectionTitle).toBe('Retos');
    expect(challengeTitles).toEqual([
      'Algo azul',
      'Tu lugar favorito',
      'Tu día en cinco palabras',
    ]);
    expect(pageText).toContain('Fotografía algo azul que tengas cerca.');
    expect(pageText).toContain('Tiempo: 120 segundos');
  }, 20_000);
});

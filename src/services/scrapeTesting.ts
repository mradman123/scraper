import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';

const scrapeTesting = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://app-affluences.packetai.co/');

  await page.focus("[name='username']");
  await page.keyboard.type('micael.paisnovo@affluences.com');

  await page.focus("[name='password']");
  await page.keyboard.type('tnI&OJB%a3Qt');

  // await page.click("button:contains('Sign-in')");

  const [signInButton] = await page.$x("//button[contains(., 'Sign-in1')]");
  if (signInButton) {
    await signInButton.click();
  } else {
    throw new Error('Sing in button not found');
  }

  const pdf = await page.pdf({ format: 'a4' });

  await fs.writeFile('testPDF.pdf', pdf);
};

export default scrapeTesting;

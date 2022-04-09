import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';

const scrapePDF = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/'
  );
  const pdf = await page.pdf({ format: 'a4' });

  await fs.writeFile('testPDF.pdf', pdf);
};

export default scrapePDF;

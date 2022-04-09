import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export const scrapeData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('SCRAPING');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/'
  );
  const pdf = await page.pdf({ format: 'a4' });

  await fs.writeFile('testPDF.pdf', pdf);

  res.send('Data scraped');
};

import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import scrapePDF from '../../services/scrapePDF';
import scrapeTesting from '../../services/scrapeTesting';
import scrape from '../../services/scrape';

export const scrapeData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  console.log('SCRAPING', email, password);

  // await scrapeTesting();
  await scrape(email, password);

  res.send('Data scraped');
};

import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import agenda from '../../services/agenda';
import scrape from '../../services/scrape';

export const scrapeData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  console.log(`Started non job scraping for ${email}`);

  await scrape(email, password);

  res.send('Data scraped');
};

export const runScrapingJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  await agenda.now('scrapingJob', { email, password });

  res.send('Job added');
};

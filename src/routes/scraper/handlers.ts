import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import jobQueue from '../../services/jobQueue';
import scrape from '../../services/scrape';

export const scrapeData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  console.log('SCRAPING', email, password);

  await scrape(email, password);

  res.send('Data scraped');
};

export const runScrapingJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  await jobQueue.now('scrapingJob', { email, password });

  res.send('Job added');
};

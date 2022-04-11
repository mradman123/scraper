import { NextFunction } from 'connect';
import { Express, Request, Response } from 'express';
import profileRouter from './profile/profile';
import pdfRouter from './pdf/pdf';
import scraperRouter from './scraper/scraper';

export default (app: Express): void => {
  app.use('/scraper', scraperRouter);
  app.use('/pdf', pdfRouter);
  app.use('/profile', profileRouter);

  app.use(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.sendStatus(200);
    }
  );
};

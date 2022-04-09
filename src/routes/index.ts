import { NextFunction } from 'connect';
import { Express, Request, Response } from 'express';
import pdfRouter from './pdf/pdf';
import scraperRouter from './scraper/scraper';

export default (app: Express): void => {
  app.use('/scraper', scraperRouter);
  app.use('/pdf', pdfRouter);

  app.use(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send({ status: 'ok' });
    }
  );
};

import { Router } from 'express';
import { scrapeData } from './handlers';

const scraperRouter = Router({ mergeParams: true });

scraperRouter.post('/', scrapeData);

export default scraperRouter;

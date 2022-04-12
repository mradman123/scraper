import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { runScrapingJob, scrapeData } from './handlers';

const scraperRouter = Router({ mergeParams: true });

scraperRouter.post('/', asyncHandler(scrapeData));
scraperRouter.post('/job', asyncHandler(runScrapingJob));

export default scraperRouter;

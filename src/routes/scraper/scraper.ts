import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { scrapeData } from './handlers';

const scraperRouter = Router({ mergeParams: true });

scraperRouter.post('/', asyncHandler(scrapeData));

export default scraperRouter;

import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { downloadPdf } from './handlers';

const pdfRouter = Router({ mergeParams: true });

pdfRouter.get('/', asyncHandler(downloadPdf));

export default pdfRouter;

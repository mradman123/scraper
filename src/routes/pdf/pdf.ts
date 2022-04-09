import { Router } from 'express';
import { downloadPdf } from './handlers';

const pdfRouter = Router({ mergeParams: true });

pdfRouter.get('/', downloadPdf);

export default pdfRouter;

import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';

export const downloadPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('DOWNLOADING');

  const pdf = await fs.readFile('testPDF.pdf');

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-disposition': `attachment; filename=testPDF.pdf`,
    'Content-Length': pdf.length,
  });

  res.end(pdf);
};

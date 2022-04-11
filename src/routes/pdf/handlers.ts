import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import UserProfileModel, { UserProfile } from '../../models/userProfile.model';

export const downloadPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.query;
  console.log('DOWNLOADING', email);
  if (!email) {
    throw new Error('Email is missing from query');
  }

  const userProfile = await UserProfileModel.findOne({
    email: email as string,
  });

  if (!userProfile) {
    throw new Error('User was not found');
  }

  const pdf = await fs.readFile(`./downloads/${userProfile.pdfFileName}`);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-disposition': `attachment; filename=${userProfile.pdfFileName}`,
    'Content-Length': pdf.length,
  });

  res.end(pdf);
};

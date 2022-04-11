import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import EducationModel from '../../models/education.model';
import ExperienceModel from '../../models/experience.model';
import LicenseAndCertificationModel from '../../models/licenseAndCertification.model';
import UserProfileModel from '../../models/userProfile.model';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.query;

  if (!email) {
    throw new Error('Email is missing from query');
  }

  const userProfile = await UserProfileModel.findOne({
    email: email as string,
  })
    .populate({
      model: EducationModel,
      path: 'educations',
    })
    .populate({
      model: ExperienceModel,
      path: 'experiences',
    })
    .populate({
      model: LicenseAndCertificationModel,
      path: 'licenseAndCertifications',
    });

  res.send(userProfile);
};

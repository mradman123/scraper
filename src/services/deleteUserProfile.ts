import EducationModel, { Education } from '../models/education.model';
import ExperienceModel, { Experience } from '../models/experience.model';
import LicenseAndCertificationModel, {
  LicenseAndCertification,
} from '../models/licenseAndCertification.model';
import UserProfileModel, { UserProfile } from '../models/userProfile.model';

const deleteUserProfile = async (email: string): Promise<void> => {
  const userProfile: UserProfile | null = await UserProfileModel.findOne({
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

  if (!userProfile) {
    console.log('Existing user profile not found');

    return;
  }

  const experienceIds = userProfile.experiences.map(
    (experience: Experience | string) => (experience as Experience)._id
  );
  const educationIds = userProfile.educations.map(
    (education: Education | string) => (education as Education)._id
  );
  const licenseAndCertificationIds = userProfile.licenseAndCertifications.map(
    (licenseAndCertification: LicenseAndCertification | string) =>
      (licenseAndCertification as LicenseAndCertification)._id
  );

  await Promise.all([
    UserProfileModel.deleteOne({ _id: userProfile._id }),
    ExperienceModel.deleteMany({ _id: { $in: experienceIds } }),
    EducationModel.deleteMany({ _id: { $in: educationIds } }),
    LicenseAndCertificationModel.deleteMany({
      _id: { $in: licenseAndCertificationIds },
    }),
  ]);

  console.log('Deleted existing user profile');
};

export default deleteUserProfile;

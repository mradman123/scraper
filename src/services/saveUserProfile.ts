import UserProfileModel, { UserProfile } from '../models/userProfile.model';
import EducationModel, {
  Education,
  EducationDocument,
} from '../models/education.model';
import ExperienceModel, {
  Experience,
  ExperienceDocument,
} from '../models/experience.model';
import LicenseAndCertificationModel, {
  LicenseAndCertification,
  LicenseAndCertificationDocument,
} from '../models/licenseAndCertification.model';

const PORT: number = parseInt(process.env.PORT as string, 10);

export const saveUserProfile = async (
  aboutMe: string,
  email: string,
  experiences: Experience[],
  skills: string[],
  suggestedSkills: string[],
  educations: Education[],
  licensesAndCertifications: LicenseAndCertification[],
  pdfFileName: string
): Promise<void> => {
  const [
    experienceDocuments,
    educationDocuments,
    licenseAndCertificationDocuments,
  ] = await Promise.all([
    ExperienceModel.insertMany(experiences),
    EducationModel.insertMany(educations),
    LicenseAndCertificationModel.insertMany(licensesAndCertifications),
  ]);

  const experienceIds: string[] = experienceDocuments.map(
    (experience: ExperienceDocument) => experience.id
  );
  const educationIds: string[] = educationDocuments.map(
    (education: EducationDocument) => education.id
  );
  const licenseAndCertificationIds: string[] =
    licenseAndCertificationDocuments.map(
      (licenseAndCertification: LicenseAndCertificationDocument) =>
        licenseAndCertification.id
    );

  const userProfile: UserProfile = {
    aboutMe,
    email,
    experiences: experienceIds,
    skills,
    suggestedSkills,
    educations: educationIds,
    licenseAndCertifications: licenseAndCertificationIds,
    pdfURL: `localhost:${PORT}/pdf?email=${email}`,
    pdfFileName,
  };

  await new UserProfileModel(userProfile).save();

  console.log('Saved user profile');
};

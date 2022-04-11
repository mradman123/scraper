import puppeteer, { Browser, Page } from 'puppeteer';
import UserProfileModel, {
  UserProfile,
  UserProfileDocument,
} from '../models/userProfile.model';
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

const windowsWidth: number = 800;
const windowsHeight: number = 600;
// const windowsWidth: number = 1920;
// const windowsHeight: number = 1080;

const scrape = async (email: string, password: string) => {
  // Open browser and go to page
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=${windowsWidth},${windowsHeight}`],
  });
  const page: Page = await browser.newPage();
  await page.setViewport({ width: windowsWidth, height: windowsHeight });

  await goToPage(page);
  await openSignInModal(page);
  await enterCredentialsAndSignIn(page, email, password);
  // await goToProfilePage(page);
  await openAccountMenu(page);
  await openProfilePage(page);
  await page.setViewport({ width: 1920, height: 1080 }); // setting the full size on start causes problems with sign in selector
  await closeSetupModal(page);
  // await downloadPdf(page);

  // Scraping
  const aboutMe = await scrapeAboutMe(page);
  const experiences = await scrapeExperiences(page);
  const { skills, suggestedSkills } = await scrapeSkills(page);
  const educations = await scrapeEducations(page);
  const licensesAndCertifications = await scrapeLicensesAndCertifications(page);

  console.log(educations);
  console.log(licensesAndCertifications);

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
    aboutMe: aboutMe as string,
    email,
    experiences: experienceIds,
    skills,
    suggestedSkills,
    educations: educationIds,
    licenseAndCertifications: licenseAndCertificationIds,
  };

  await new UserProfileModel(userProfile).save();

  await browser.close();
  console.log('Browser closed');

  // const experienceDocuments = await ExperienceModel.insertMany(experiences);

  // console.log(
  //   experienceDocuments.map((experience: ExperienceDocument) => experience.id)
  // );
};

const goToPage = async (page: Page) => {
  await page.goto('https://www.glassdoor.com');
  await page.waitForTimeout(1000);

  console.log('Gone to page');
};

const openSignInModal = async (page: Page) => {
  // const [signInButton] = await page.$x("//button[contains(., 'Sign In')]");
  const [signInButton] = await page.$x("//button[contains(text(), 'Sign In')]");
  if (signInButton) {
    await signInButton.click();
  } else {
    throw new Error('Sing in button not found');
  }

  await page.waitForTimeout(1000);

  console.log('Opened sign in modal');
};

const enterCredentialsAndSignIn = async (
  page: Page,
  email: string,
  password: string
) => {
  await page.focus("[name='username']");
  await page.keyboard.type(email);
  await page.focus("[name='password']");
  await page.keyboard.type(password);

  await page.click("[name='submit']");
  await page.waitForNavigation();
  await page.waitForTimeout(2000);

  console.log('Submitted credentials');
};

const goToProfilePage = async (page: Page) => {
  // const [profileCard] = await page.$x("//div[contains(., 'Ravi Van')]");
  // if (profileCard) {
  //   // await profileCard.click();
  //   await profileCard.evaluate((b) => (b as HTMLElement).click());
  // } else {
  //   throw new Error('Profile card not found');
  // }

  // page.goto(
  //   'https://www.glassdoor.com/member/profile/index.htm?profileOrigin=MEMBER_HOME'
  // );

  await page.waitForTimeout(1000);
  // await page.screenshot({ path: 'goToProfilePage.png' });
};

const openAccountMenu = async (page: Page) => {
  await page.click("[title='Open Account Menu']");
  await page.waitForTimeout(1000);

  console.log('Opened account menu');
};

const openProfilePage = async (page: Page) => {
  await page.click("[data-ga-lbl='My Profile']");
  await page.waitForTimeout(4000);

  console.log('Opened profile page');
};

const closeSetupModal = async (page: Page) => {
  const [closeButton] = await page.$x("//div[contains(text(), 'Close')]");
  if (closeButton) {
    await closeButton.click();
  } else {
    throw new Error('Close button not found');
  }

  // await page.click("[fill='#505863']");
  await page.waitForTimeout(2000);

  console.log('Closed setup modal');
};

const scrapeAboutMe = async (
  page: Page
): Promise<string | null | undefined> => {
  const aboutMeElement = await page.waitForSelector(
    "[data-test='description']"
  );
  const aboutMe = await aboutMeElement?.evaluate((el) => el.textContent);

  return aboutMe;
};

const scrapeExperiences = async (page: Page): Promise<ExperienceDocument[]> => {
  const experienceSection = (await page.$$('#Experience'))[0];

  if (!experienceSection) {
    throw new Error('Experience section not found');
  }

  const [
    titles,
    employers,
    locations,
    employmentPeriods,
    employmentDescriptions,
  ] = await Promise.all([
    experienceSection.$$eval("[data-test='title']", textExtractor),
    experienceSection.$$eval("[data-test='employer']", textExtractor),
    experienceSection.$$eval("[data-test='location']", textExtractor),
    experienceSection.$$eval("[data-test='employmentperiod']", textExtractor),
    experienceSection.$$eval("[data-test='description']", textExtractor),
  ]);

  const experiences: ExperienceDocument[] = [];

  titles.forEach((title: string | null, index: number) => {
    if (title) {
      const experience = new ExperienceModel({
        title,
        employer: employers[index] as string,
        location: locations[index] as string,
        employmentPeriod: employmentPeriods[index] as string,
        description: employmentDescriptions[index] as string,
      });
      experiences.push(experience);
    }
  });

  return experiences;
};

// return : Promise<{(string | null)[]}>
const scrapeSkills = async (page: Page) => {
  const skillsSection = (await page.$$('#Skills'))[0];

  if (!skillsSection) {
    throw new Error('Skills section not found');
  }

  const allSkills = await skillsSection.$$eval(
    '.css-zomrfc > span',
    textExtractor
  );
  const skills: string[] = [];
  const suggestedSkills: string[] = [];

  allSkills.forEach((skill) => {
    if (!skill) {
      return;
    }
    if (skill.includes('+')) {
      suggestedSkills.push(skill.replace('+', ''));
    } else {
      skills.push(skill);
    }
  });

  return { skills, suggestedSkills };
};

const scrapeEducations = async (page: Page): Promise<EducationDocument[]> => {
  const educationSection = (await page.$$('#Education'))[0];

  if (!educationSection) {
    throw new Error('Eduction section not found');
  }

  const [
    universities,
    degrees,
    locations,
    graduationDates,
    educationDescriptions,
  ] = await Promise.all([
    educationSection.$$eval("[data-test='university']", textExtractor),
    educationSection.$$eval("[data-test='degree']", textExtractor),
    educationSection.$$eval("[data-test='location']", textExtractor),
    educationSection.$$eval("[data-test='graduationDate']", textExtractor),
    educationSection.$$eval("[data-test='description']", textExtractor),
  ]);

  const educations: EducationDocument[] = [];

  universities.forEach((university: string | null, index: number) => {
    if (university) {
      const education = new EducationModel({
        university,
        degree: degrees[index] as string,
        location: locations[index] as string,
        graduationDate: graduationDates[index] as string,
        description: educationDescriptions[index] as string,
      });
      educations.push(education);
    }
  });

  return educations;
};

const scrapeLicensesAndCertifications = async (
  page: Page
): Promise<LicenseAndCertificationDocument[]> => {
  const licenseAndEductionSection = (await page.$$('#Certification'))[0];

  if (!licenseAndEductionSection) {
    throw new Error('Eduction section not found');
  }

  const [
    titles,
    employers,
    certificationPeriods,
    licenseAndEductionDescriptions,
  ] = await Promise.all([
    licenseAndEductionSection.$$eval("[data-test='title']", textExtractor),
    licenseAndEductionSection.$$eval(
      "[data-test='employer'] > a",
      textExtractor
    ),
    licenseAndEductionSection.$$eval(
      "[data-test='certificationperiod']",
      textExtractor
    ),
    licenseAndEductionSection.$$eval(
      "[data-test='description']",
      textExtractor
    ),
  ]);

  const licensesAndCertifications: LicenseAndCertificationDocument[] = [];

  titles.forEach((title: string | null, index: number) => {
    if (title) {
      const licenseAndCertification = new LicenseAndCertificationModel({
        title,
        employer: employers[index] as string,
        certificationPeriod: certificationPeriods[index] as string,
        description: licenseAndEductionDescriptions[index] as string,
      });
      licensesAndCertifications.push(licenseAndCertification);
    }
  });

  return licensesAndCertifications;
};

const downloadPdf = async (page: Page) => {
  // await page.click("[id='prefix__icon-download-2']");

  // await page.waitForTimeout(3000);
  // console.log('Downloaded PDF');
  // await page.screenshot({ path: 'downloadPdf.png' });

  const profileInfoSection = (await page.$$('#ProfileInfo'))[0];
  await page.click('#prefix__icon-download-2');

  if (!profileInfoSection) {
    throw new Error('Profile info section not found');
  }
};

const textExtractor = (elements: Element[]) =>
  elements.map((element: Element) => element.textContent);

export default scrape;

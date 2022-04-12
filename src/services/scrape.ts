import puppeteer, { Browser, Page } from 'puppeteer';
import EducationModel, { EducationDocument } from '../models/education.model';
import ExperienceModel, {
  ExperienceDocument,
} from '../models/experience.model';
import LicenseAndCertificationModel, {
  LicenseAndCertificationDocument,
} from '../models/licenseAndCertification.model';
import elementsTextExtractor from '../utils/elementsTextExtractor';
import deleteUserProfile from './deleteUserProfile';
import saveUserProfile from './saveUserProfile';

const windowsWidth: number = 800;
const windowsHeight: number = 600;

const scrape = async (email: string, password: string) => {
  const browser: Browser = await puppeteer.launch({
    args: [`--window-size=${windowsWidth},${windowsHeight}`],
  });
  const page: Page = await browser.newPage();

  await page.setViewport({ width: windowsWidth, height: windowsHeight });

  try {
    await goToPage(page);
    await openSignInModal(page);
    await enterCredentialsAndSignIn(page, email, password);
    await openAccountMenu(page);
    await openProfilePage(page);
    await page.setViewport({ width: 1920, height: 1080 }); // setting the bigger size on start causes problems with sign in selector
    await closeSetupModal(page);

    const pdfFileName: string = await downloadPdfAndReturnFileName(page);

    const aboutMe = await scrapeAboutMe(page);
    const experiences = await scrapeExperiences(page);
    const { skills, suggestedSkills } = await scrapeSkills(page);
    const educations = await scrapeEducations(page);
    const licensesAndCertifications = await scrapeLicensesAndCertifications(
      page
    );

    await deleteUserProfile(email);
    await saveUserProfile(
      aboutMe as string,
      email,
      experiences,
      skills as string[],
      suggestedSkills as string[],
      educations,
      licensesAndCertifications,
      pdfFileName
    );

    await openNavigationMenu(page);
    await signOut(page);

    await browser.close();
    console.log('Closed browser');
  } catch (error) {
    await browser.close();
    console.log('Closed browser');

    throw error;
  }
};

const goToPage = async (page: Page) => {
  await page.goto('https://www.glassdoor.com');
  await page.waitForTimeout(1000);

  console.log('Went to page');
};

const openSignInModal = async (page: Page) => {
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
  await page.waitForTimeout(3000);

  const [failedLoginDescription] = await page.$$('#descriptionColor');

  if (failedLoginDescription) {
    throw new Error('Invalid credentials');
  }

  console.log('Submitted credentials');
};

const openAccountMenu = async (page: Page) => {
  await page.click("[title='Open Account Menu']");
  await page.waitForTimeout(1000);

  console.log('Opened account menu');
};

const openProfilePage = async (page: Page) => {
  await page.click("[data-ga-lbl='My Profile']");
  await page.waitForTimeout(3000);

  console.log('Opened profile page');
};

const closeSetupModal = async (page: Page) => {
  const [closeButton] = await page.$x("//div[contains(text(), 'Close')]");
  if (closeButton) {
    await closeButton.click();
  } else {
    throw new Error('Close button not found');
  }

  await page.waitForTimeout(2000);

  console.log('Closed setup modal');
};

const scrapeAboutMe = async (
  page: Page
): Promise<string | null | undefined> => {
  const [aboutMeSection] = await page.$$('#AboutMe');

  if (!aboutMeSection) {
    throw new Error('About me section not found');
  }

  const aboutMeElement = await aboutMeSection.waitForSelector(
    "[data-test='description']"
  );
  const aboutMe = await aboutMeElement?.evaluate((el) => el.textContent);

  console.log('Scraped about me');

  return aboutMe;
};

const scrapeExperiences = async (page: Page): Promise<ExperienceDocument[]> => {
  const [experienceSection] = await page.$$('#Experience');

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
    experienceSection.$$eval("[data-test='title']", elementsTextExtractor),
    experienceSection.$$eval("[data-test='employer']", elementsTextExtractor),
    experienceSection.$$eval("[data-test='location']", elementsTextExtractor),
    experienceSection.$$eval(
      "[data-test='employmentperiod']",
      elementsTextExtractor
    ),
    experienceSection.$$eval(
      "[data-test='description']",
      elementsTextExtractor
    ),
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

  console.log('Scraped experiences');

  return experiences;
};

const scrapeSkills = async (
  page: Page
): Promise<{ [key: string]: (string | null)[] }> => {
  const [skillsSection] = await page.$$('#Skills');

  if (!skillsSection) {
    throw new Error('Skills section not found');
  }

  const allSkills = await skillsSection.$$eval(
    '.css-zomrfc > span',
    elementsTextExtractor
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

  console.log('Scraped skills');

  return { skills, suggestedSkills };
};

const scrapeEducations = async (page: Page): Promise<EducationDocument[]> => {
  const [educationSection] = await page.$$('#Education');

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
    educationSection.$$eval("[data-test='university']", elementsTextExtractor),
    educationSection.$$eval("[data-test='degree']", elementsTextExtractor),
    educationSection.$$eval("[data-test='location']", elementsTextExtractor),
    educationSection.$$eval(
      "[data-test='graduationDate']",
      elementsTextExtractor
    ),
    educationSection.$$eval("[data-test='description']", elementsTextExtractor),
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

  console.log('Scraped educations');

  return educations;
};

const scrapeLicensesAndCertifications = async (
  page: Page
): Promise<LicenseAndCertificationDocument[]> => {
  const [licenseAndEductionSection] = await page.$$('#Certification');

  if (!licenseAndEductionSection) {
    throw new Error('Eduction section not found');
  }

  const [
    titles,
    employers,
    certificationPeriods,
    licenseAndEductionDescriptions,
  ] = await Promise.all([
    licenseAndEductionSection.$$eval(
      "[data-test='title']",
      elementsTextExtractor
    ),
    licenseAndEductionSection.$$eval(
      "[data-test='employer'] > a",
      elementsTextExtractor
    ),
    licenseAndEductionSection.$$eval(
      "[data-test='certificationperiod']",
      elementsTextExtractor
    ),
    licenseAndEductionSection.$$eval(
      "[data-test='description']",
      elementsTextExtractor
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

  console.log('Scraped licenses and certifications');

  return licensesAndCertifications;
};

const downloadPdfAndReturnFileName = async (page: Page): Promise<string> => {
  // @ts-ignore
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './downloads',
  });

  const [profileInfoSection] = await page.$$('#ProfileInfo');
  const [profileInfoActionSection] = await profileInfoSection.$$(
    '[class*=profileInfoStyle__actions]'
  );

  if (!profileInfoSection || !profileInfoActionSection) {
    throw new Error('Profile info section not found');
  }

  const [profileName] = await profileInfoSection.$$eval(
    'h3',
    elementsTextExtractor
  );
  const downloadButton = (await profileInfoActionSection.$$('button'))[1];

  if (!downloadButton) {
    throw new Error('Download button not found');
  }
  await downloadButton.click();
  await page.waitForTimeout(2000);

  console.log('Downloaded pdf');

  return `${profileName!.replace(/ /g, '_')}.pdf`;
};

const openNavigationMenu = async (page: Page) => {
  const [navigationMenu] = await page.$$(
    "[data-test='user-profile-dropdown-trigger']"
  );

  if (!navigationMenu) {
    throw new Error('Navigation menu not found');
  }
  navigationMenu.hover();
  await page.waitForTimeout(1000);

  console.log('Opened navigation menu');
};

const signOut = async (page: Page) => {
  await page.mouse.move(1530, 530);
  await page.waitForTimeout(500);
  await page.mouse.click(1530, 530);
  await page.waitForNavigation();
  await page.waitForTimeout(500);

  console.log('Signed out');
};

export default scrape;

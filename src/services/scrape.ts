import puppeteer, { Browser, Page } from 'puppeteer';
import { UserProfile } from '../models/userProfile.model';

const windowsWidth: number = 800;
const windowsHeight: number = 600;
// const windowsWidth: number = 1920;
// const windowsHeight: number = 1080;

const scrape = async (email: string, password: string) => {
  // Open browser and go to page
  const browser: Browser = await puppeteer.launch({
    // headless: false,
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
  const { titles } = await scrapeExperiences(page);

  const userProfile: UserProfile = {
    aboutMe: aboutMe as string,
    email,
  };

  await browser.close();
  console.log('Browser closed');
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
  await page.waitForTimeout(1000);

  console.log('Opened profile page');
};

const closeSetupModal = async (page: Page) => {
  const [closeButton] = await page.$x("//div[contains(text(), 'Close')]");
  if (closeButton) {
    await closeButton.click();
    // await closeButton.evaluate((b) => (b as HTMLElement).click());
  } else {
    throw new Error('Close button not found');
  }

  // await page.click("[fill='#505863']");
  await page.waitForTimeout(2000);

  console.log('Closed setup modal');
};

const scrapeAboutMe = async (page: Page) => {
  const aboutMeElement = await page.waitForSelector(
    "[data-test='description']"
  );
  const aboutMe = await aboutMeElement?.evaluate((el) => el.textContent);

  return aboutMe;
};

const scrapeExperiences = async (page: Page) => {
  const titles = await page.$$eval("[data-test='title']", textExtractor);
  const employers = await page.$$eval("[data-test='employer']", textExtractor);
  const locations = await page.$$eval("[data-test='location']", textExtractor);
  const employmentPeriods = await page.$$eval(
    "[data-test='employmentperiod']",
    textExtractor
  );
  const employmentDescriptions = await page.$$eval(
    "[data-test='description']",
    textExtractor
  );

  console.log(
    titles,
    employers,
    locations,
    employmentPeriods,
    employmentDescriptions
  );

  return {
    titles,
    employers,
    locations,
    employmentPeriods,
    employmentDescriptions,
  };
};

const downloadPdf = async (page: Page) => {
  await page.click("[id='prefix__icon-download-2']");

  await page.waitForTimeout(3000);
  console.log('Downloaded PDF');
  await page.screenshot({ path: 'downloadPdf.png' });
};

const textExtractor = (elements: Element[]) =>
  elements.map((element: Element) => element.textContent);

export default scrape;

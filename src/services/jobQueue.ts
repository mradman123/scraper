// import { Agenda } from 'agenda/es';
import Agenda, { Job } from 'agenda';
import scrape from './scrape';

const dbUri: string = process.env.MONGODB_URI || 'localhost:27017';

const jobQueue = new Agenda({
  db: {
    address: dbUri,
    collection: 'jobs',
  },
  maxConcurrency: 10,
});

jobQueue.start();

jobQueue.define('scrapingJob', async (job: Job) => {
  const { data } = job.attrs;

  console.log('Running a scraping job with data:', data);

  await scrape(data?.email, data?.password);
});

export default jobQueue;

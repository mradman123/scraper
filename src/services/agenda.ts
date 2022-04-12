import Agenda, { Job } from 'agenda';
import scrape from './scrape';

const dbUri: string = process.env.MONGODB_URI || 'localhost:27017';

const agenda = new Agenda({
  db: {
    address: dbUri,
    collection: 'jobs',
  },
  maxConcurrency: 10,
});

agenda.on('start', (job) => {
  console.log(`Job ${job.attrs.name} for ${job.attrs.data?.email} starting`);
});
agenda.on('complete', (job) => {
  console.log(`Job ${job.attrs.name} for ${job.attrs.data?.email} finished`);
});
agenda.on('fail', (err: Error, job: Job) => {
  console.log(
    `Job ${job.attrs.name} for ${job.attrs.data?.email} failed with error: ${err.message}`
  );
  // Handle failed job(retry, report...)
});

agenda.start();

agenda.define('scrapingJob', async (job: Job, done) => {
  const { data } = job.attrs;

  console.log('Running a scraping job with data:', data);

  await scrape(data?.email, data?.password);

  done();
});

export default agenda;

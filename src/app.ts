import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import routes from './routes';

const app: Express = express();

(async () => {
  app.use(compression());
  app.use(bodyParser.json());
  app.set('trust proxy', 1);
  app.use(cors());

  routes(app);
})();

export default app;

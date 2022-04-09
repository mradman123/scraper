require('dotenv').config();
import app from './app';
import mongooseService from './services/mongooseService';

const PORT: number = parseInt(process.env.PORT as string, 10);
const HOST = process.env.HOST as string;

app.listen(PORT, HOST, async () => {
  await mongooseService.connect();
});

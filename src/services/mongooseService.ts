import mongoose, { ConnectionOptions } from 'mongoose';

const dbUri: string = process.env.MONGODB_URI || 'localhost:27017';
console.log(process.env.MONGODB_URI);
const dbOptions: ConnectionOptions = {
  autoReconnect: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
};

const connect = async () => {
  const db = mongoose.connection;
  db.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  db.on('error', (error) => {
    console.log('MongoDB connection error:', error);
    mongoose.disconnect();
  });
  db.on('connected', () => {
    console.log('MongoDB connected!');
  });
  db.once('open', () => {
    console.log('MongoDB connection opened!');
  });
  db.on('reconnected', () => {
    console.log('MongoDB reconnected!');
  });
  db.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    mongoose.connect(dbUri, dbOptions);
  });

  try {
    await mongoose.connect(dbUri, dbOptions);
  } catch (error) {
    throw new Error('Connection failed');
  }
};

export default {
  connect,
};

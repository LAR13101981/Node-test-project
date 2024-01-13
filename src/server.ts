import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import mongoose from 'mongoose';

dotenv.config();

const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL!, {});

    server.listen(PORT, () => {
      console.log(`Server listenning on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB');
  }
}

startServer();

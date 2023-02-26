import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import router from './router/router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/errorMiddleware.js';
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_LOCAL_URL,
}));
app.use(cookieParser());
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch(err) {
    console.log(err);
  }
}

start();

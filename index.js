import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import router from './router/router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 5000;
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(PORT, () => console.log(`started on port ${PORT}`));
  } catch(err) {
    console.log(err);
  }
}

start();

import express from 'express';
import mongoose from 'mongoose';
import authRouter from './authRouter.js';
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rsclone');
    app.listen(PORT, () => console.log(`started on port ${PORT}`));
  } catch(err) {
    console.log(err);
  }
}

start();

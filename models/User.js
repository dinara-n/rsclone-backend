import { Schema, model } from "mongoose";

const User = new Schema({
  data: {
    firstName: { type: String, unique: false, required: true },
    patronymic: { type: String, unique: false, required: true },
    surname: { type: String, unique: false, required: true },
    birthday: { type: String, unique: false, required: true },
    mail: { type: String, unique: true, required: true },
    phone: { type: String, unique: false, required: true },
    password: { type: String, unique: false, required: true },
  },
  role: { type: String, unique: false, required: true },
});

export default model('User', User);

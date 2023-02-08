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
  settings: {
    language: { type: String, unique: false, required: false },
  },
  // companies: [{ type: Schema.Types.ObjectId, unique: false, required: false, ref: 'Company' }],
  // todos: [{ type: Schema.Types.ObjectId, unique: false, required: false, ref: 'Todo' }],
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

User.virtual('companies', {
  ref: 'Company',
  localField: '_id',
  foreignField: 'users',
})

User.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'users',
})

export default model('User', User);

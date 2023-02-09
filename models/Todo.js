import { Schema, model } from "mongoose";

const Todo = new Schema({
  data: {
    type: { type: String, unique: false, required: true },
    startTime: { type: String, unique: false, required: true },
    endTime: { type: String, unique: false, required: true },
    title: { type: String, unique: false, required: true },
    text: { type: String, unique: false, required: false },
  },
  isDone: { type: Boolean, unique: false, required: true },
  extra: {
    year: { type: String, unique: false, required: true },
    month: { type: String, unique: false, required: true },
    day: { type: String, unique: false, required: true },
  },
  company: { type: Schema.Types.ObjectId, unique: false, required: true, ref: 'Company' },
  users: [{ type: Schema.Types.ObjectId, unique: false, required: true, ref: 'User' }],
});

export default model('Todo', Todo);

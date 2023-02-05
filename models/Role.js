import { Schema, model } from "mongoose";

const Role = new Schema({
  value: { type: String, unique: true, required: true, default: 'salesman' },
});

export default model('Role', Role);

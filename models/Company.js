import { Schema, model } from "mongoose";

const Company = new Schema({
  data: {
    companyName: { type: String, unique: false, required: true },
    inn: { type: Number, unique: true, required: true },
    address: { type: String, unique: false, required: false },
  },
  contacts: {
    commonPhone: [{ type: String, unique: false, required: false }],
    commonMail: { type: String, unique: false, required: true },
    workers: [{
      firstName: { type: String, unique: false, required: false },
      patronymic: { type: String, unique: false, required: false },
      surname: { type: String, unique: false, required: false },
      birthday: { type: String, unique: false, required: false },
      mail: { type: String, unique: false, required: false },
      phone: [{ type: String, unique: false, required: false }],
    }],
  },
  users: [{ type: Schema.Types.ObjectId, unique: false, required: false, ref: 'User' }],
  // todos: [{ type: Schema.Types.ObjectId, unique: false, required: false, ref: 'Todo' }],
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

Company.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'company',
})

export default model('Company', Company);

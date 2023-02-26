import { Schema, model } from "mongoose";

const Company = new Schema({
  data: {
    companyName: { type: String, unique: false, required: true },
    inn: { type: Number, unique: false, required: false },
    address: { type: String, unique: false, required: false },
  },
  contacts: {
    commonPhone: [{ type: String, unique: false, required: true }],
    commonMail: { type: String, unique: false, required: false },
    workers: [{
      firstName: { type: String, unique: false, required: false },
      patronymic: { type: String, unique: false, required: false },
      surname: { type: String, unique: false, required: false },
      birthday: { type: String, unique: false, required: false },
      mail: { type: String, unique: false, required: false },
      phone: [{ type: String, unique: false, required: false }],
    }],
  },
  users: [{ type: Schema.Types.ObjectId, unique: false, required: true, ref: 'User' }],
  archived: { type: Boolean, unique: false, required: false },
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

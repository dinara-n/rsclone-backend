import { Schema, model } from "mongoose";

const Token = new Schema({
  user: {
    userId: { type: Schema.Types.ObjectId, unique: true, required: true, ref: 'User' },
    refreshTokens: [{ type: String, unique: false, required: false }],
  },
});

export default model('Token', Token);

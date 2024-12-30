import { Schema, Model, Document, model } from 'mongoose';
import { UserDTO } from '../dtos/user.dto';

const UserSchema = new Schema({
  username: { type: String, required: false },
  password: { type: String, required: false },
  provider: { type: String, required: false },
  externalId: { type: String, required: false },
});

export const UserModel: Model<Document<UserDTO>> = model('User', UserSchema);

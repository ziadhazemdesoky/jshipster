import { Schema, Model, Document, model } from 'mongoose';
import { OAuthTokenDTO } from '../dtos/oauthToken.dto';

const TokenSchema = new Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: false },
  provider: { type: String, required: true },
  userId: { type: String, required: true },
});

export const TokenModel: Model<Document<OAuthTokenDTO>> = model('Token', TokenSchema);

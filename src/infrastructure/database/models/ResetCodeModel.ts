import { Schema, Document, model } from 'mongoose';
import { ICodeRegisterDocument } from './CodeRegisterSchema';

export interface IResetCodeDocument extends Document {
  userId: string;
  code: string;
  createdAt: Date;
}

const ResetCodeSchema = new Schema<ICodeRegisterDocument>({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' },
});

export const ResetCodeModel = model<IResetCodeDocument>('ResetCode', ResetCodeSchema);
export { ResetCodeSchema };

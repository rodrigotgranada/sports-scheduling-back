// src/infrastructure/database/models/LogModel.ts
import { Document, Schema, model } from 'mongoose';

export interface ILogDocument extends Document {
  type: string;
  userId: string;
  message: string;
  timestamp: Date;
  createdAt: Date;
}

const LogSchema = new Schema<ILogDocument>({
  type: { type: String, required: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const LogModel = model<ILogDocument>('Log', LogSchema);
export { LogSchema };

import { Schema, Document, model, models } from 'mongoose';

export interface ICodeRegisterDocument extends Document {
  userId: string;
  code: string;
  createdAt: Date;
}

const CodeRegisterSchema = new Schema<ICodeRegisterDocument>({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const CodeRegisterModel = models.CodeRegister || model<ICodeRegisterDocument>('CodeRegister', CodeRegisterSchema);
export { CodeRegisterModel, CodeRegisterSchema };

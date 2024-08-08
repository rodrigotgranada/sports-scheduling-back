import { Schema, Document, model } from 'mongoose';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  isActive: 'pending' | 'active' | 'blocked';
  role: 'user' | 'admin' | 'owner';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  foto?: string; // Adicionando o campo foto como opcional
}

const UserSchema = new Schema<IUserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  createdBy: { type: String, default: '' },
  updatedBy: { type: String, default: '' },
  foto: { type: String, default: '' } // Adicionando o campo foto como opcional
}, { timestamps: true });

export const UserModel = model<IUserDocument>('User', UserSchema);
export { UserSchema };

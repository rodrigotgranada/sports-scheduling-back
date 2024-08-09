// src/infrastructure/database/models/ConfigModel.ts
import { Schema, Document, model } from 'mongoose';

export interface IConfigDocument extends Document {
  canViewUsers: string[]; // roles that can view users
  canEditUsers: string[]; // roles that can edit users
  canDeleteUsers: string[]; // roles that can delete users
  canBlockUsers: string[]; // roles that can block/unblock users
  editableFields: string[]; // fields that can be edited by admin
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema = new Schema<IConfigDocument>({
  canViewUsers: { type: [String], required: true },
  canEditUsers: { type: [String], required: true },
  canDeleteUsers: { type: [String], required: true },
  canBlockUsers: { type: [String], required: true },
  editableFields: { type: [String], required: true },
}, { timestamps: true });

export const ConfigModel = model<IConfigDocument>('Config', ConfigSchema);
export { ConfigSchema };

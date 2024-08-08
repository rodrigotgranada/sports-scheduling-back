import { ICodeRegisterDocument } from '../../infrastructure/database/models/CodeRegisterSchema';

export interface ICodeRegisterRepository {
  createCodeRegister(data: { userId: string; code: string }): Promise<ICodeRegisterDocument>;
  findCodeByUserId(userId: string): Promise<ICodeRegisterDocument | null>;
  deleteCodeRegisterByUserId(userId: string): Promise<void>;
}

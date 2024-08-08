import { ICodeRegisterRepository } from '../../../domain/repositories/ICodeRegisterRepository';
import { CodeRegisterModel, ICodeRegisterDocument } from '../models/CodeRegisterSchema';

export class CodeRegisterRepository implements ICodeRegisterRepository {
  async createCodeRegister(data: { userId: string; code: string }): Promise<ICodeRegisterDocument> {
    const codeRegister = new CodeRegisterModel(data);
    await codeRegister.save();
    return codeRegister;
  }

  async findCodeByUserId(userId: string): Promise<ICodeRegisterDocument | null> {
    return CodeRegisterModel.findOne({ userId }).exec();
  }

  async deleteCodeRegisterByUserId(userId: string): Promise<void> {
    await CodeRegisterModel.deleteOne({ userId }).exec();
  }
}

import { IResetCodeRepository } from '../../../domain/repositories/IResetCodeRepository';
import { ResetCodeModel, IResetCodeDocument } from '../models/ResetCodeModel';

export class ResetCodeRepository implements IResetCodeRepository {
  async createResetCode(data: { userId: string; code: string }): Promise<IResetCodeDocument> {
    const resetCode = new ResetCodeModel(data);
    await resetCode.save();
    return resetCode;
  }

  async findResetCodeByUserId(userId: string): Promise<IResetCodeDocument | null> {
    return ResetCodeModel.findOne({ userId }).exec();
  }

  async deleteResetCodeByUserId(userId: string): Promise<void> {
    await ResetCodeModel.deleteOne({ userId }).exec();
  }
}

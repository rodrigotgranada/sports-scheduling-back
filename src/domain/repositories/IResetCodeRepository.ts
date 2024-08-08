import { IResetCodeDocument } from '../../infrastructure/database/models/ResetCodeModel';

export interface IResetCodeRepository {
  createResetCode(data: { userId: string; code: string }): Promise<IResetCodeDocument>;
  findResetCodeByUserId(userId: string): Promise<IResetCodeDocument | null>;
  deleteResetCodeByUserId(userId: string): Promise<void>;
}

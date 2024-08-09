import { ILogRepository } from 'src/domain/repositories/ILogRepository';
import { LogModel, ILogDocument } from 'src/infrastructure/database/models/LogModel';

export class LogRepository implements ILogRepository {
  async createLog(log: Partial<ILogDocument>): Promise<ILogDocument> {
    const logDocument = new LogModel(log);
    await logDocument.save();
    return logDocument;
  }

  async getLogs(): Promise<ILogDocument[]> {
    return LogModel.find().exec();
  }

  async getLogById(id: string): Promise<ILogDocument | null> {
    return LogModel.findById(id).exec();
  }

  async deleteLogById(id: string): Promise<void> {
    await LogModel.findByIdAndDelete(id).exec();
  }
}

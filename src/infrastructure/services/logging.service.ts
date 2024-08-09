import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ILogRepository } from 'src/domain/repositories/ILogRepository';
import { Log } from 'src/domain/entities/Log';

@Injectable()
export class LoggingService {
  constructor(
    @Inject('ILogRepository') private readonly logRepository: ILogRepository,
  ) {}

  async logActivity(type: string, userId: string, message: string): Promise<void> {
    const log = new Log(type, userId, message, new Date());
    await this.logRepository.createLog({
      type: log.type,
      userId: log.userId,
      message: log.message,
      timestamp: log.timestamp,
      createdAt: log.createdAt,
    } as any);  // Casting para any para evitar erros de tipo
  }

  async getLogs(): Promise<Log[]> {
    const logDocuments = await this.logRepository.getLogs();
    return logDocuments.map(logDoc => new Log(
      logDoc.type,
      logDoc.userId,
      logDoc.message,
      logDoc.timestamp,
      logDoc.createdAt,
    ));
  }

  async getLogById(id: string): Promise<Log> {
    const logDocument = await this.logRepository.getLogById(id);
    if (!logDocument) {
      throw new NotFoundException('Log not found');
    }
    return new Log(
      logDocument.type,
      logDocument.userId,
      logDocument.message,
      logDocument.timestamp,
      logDocument.createdAt,
    );
  }

  async deleteLogById(id: string): Promise<void> {
    await this.logRepository.deleteLogById(id);
  }
}

import { ILogDocument } from 'src/infrastructure/database/models/LogModel';

export interface ILogRepository {
  createLog(log: Partial<ILogDocument>): Promise<ILogDocument>;
  getLogs(): Promise<ILogDocument[]>;
  getLogById(id: string): Promise<ILogDocument | null>;  // Novo método adicionado
  deleteLogById(id: string): Promise<void>;  // Método atualizado
}

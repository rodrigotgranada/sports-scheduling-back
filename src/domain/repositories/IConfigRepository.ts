// src/domain/repositories/IConfigRepository.ts
import { IConfigDocument } from 'src/infrastructure/database/models/ConfigModel';

export interface IConfigRepository {
  getConfig(): Promise<IConfigDocument>;
  updateConfig(config: IConfigDocument): Promise<IConfigDocument>;
}

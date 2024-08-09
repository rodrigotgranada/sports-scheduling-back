// src/infrastructure/database/repositories/ConfigRepository.ts
import { IConfigRepository } from 'src/domain/repositories/IConfigRepository';
import { IConfigDocument, ConfigModel } from '../models/ConfigModel';

export class ConfigRepository implements IConfigRepository {
  async getConfig(): Promise<IConfigDocument> {
    return ConfigModel.findOne().exec();
  }

  async updateConfig(config: IConfigDocument): Promise<IConfigDocument> {
    return ConfigModel.findOneAndUpdate({}, config, { new: true }).exec();
  }
}

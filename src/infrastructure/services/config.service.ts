// src/infrastructure/services/config.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IConfigRepository } from 'src/domain/repositories/IConfigRepository';
import { IConfigDocument } from 'src/infrastructure/database/models/ConfigModel';

@Injectable()
export class ConfigService {
  constructor(@Inject('IConfigRepository') private readonly configRepository: IConfigRepository) {}

  async getConfig(): Promise<IConfigDocument> {
    return this.configRepository.getConfig();
  }

  async updateConfig(config: IConfigDocument): Promise<IConfigDocument> {
    return this.configRepository.updateConfig(config);
  }

  async canViewUsers(role: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.canViewUsers.includes(role);
  }

  async getEditableFields(role: string): Promise<string[]> {
    const config = await this.getConfig();
    return config.editableFields.includes(role) ? config.editableFields : [];
  }

  async canDeleteUser(role: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.canDeleteUsers.includes(role);
  }

  async canBlockUser(role: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.canBlockUsers.includes(role);
  }

  async getCreateUserFields(role: string): Promise<string[]> {
    const config = await this.getConfig();
    return config.editableFields.includes(role) ? config.editableFields : [];
  }
}

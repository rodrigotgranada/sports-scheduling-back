// src/interface-adapters/controllers/config.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ConfigService } from 'src/infrastructure/services/config.service';
import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { IConfigDocument } from 'src/infrastructure/database/models/ConfigModel';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConfig() {
    return this.configService.getConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateConfig(@Body() config: IConfigDocument) {
    return this.configService.updateConfig(config);
  }
}

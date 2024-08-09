import { Controller, Get, Delete, Param, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';

@Controller('logs')
export class LogController {
  constructor(private readonly loggingService: LoggingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLogs(@Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para visualizar todos os logs');
    }
    return this.loggingService.getLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLogById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para visualizar este log');
    }
    return this.loggingService.getLogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteLogById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para deletar logs');
    }
    await this.loggingService.deleteLogById(id);
    return { message: 'Log deleted successfully' };
  }
}

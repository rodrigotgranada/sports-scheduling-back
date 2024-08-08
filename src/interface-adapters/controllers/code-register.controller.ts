import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CodeRegisterRepository } from '../../infrastructure/database/repositories/CodeRegisterRepository';

@Controller('code-register')
export class CodeRegisterController {
  constructor(private readonly codeRegisterRepository: CodeRegisterRepository) {}

  @Post()
  async createCode(@Body() createCodeDto: { userId: string; code: string }) {
    return this.codeRegisterRepository.createCodeRegister(createCodeDto);
  }

  @Get(':userId')
  async findCodeByUserId(@Param('userId') userId: string) {
    return this.codeRegisterRepository.findCodeByUserId(userId);
  }
}

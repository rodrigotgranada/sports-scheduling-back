import { Controller, Post, Body, UseGuards, Request, Get, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('foto')) // O nome do campo deve ser 'foto'
  async register(@Body() registerUserDto: RegisterUserDTO, @UploadedFile() file: Express.Multer.File) {
    return this.authService.register(registerUserDto, file);
  }

  @Post('login')
  async login(@Body() loginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('activate')
  async activateUser(@Body() body: { email: string, code: string }) {
    return this.authService.activateUser(body.email, body.code);
  }

  @Post('regenerate-activation-code')
  async regenerateActivationCode(@Body() body: { email: string }) {
    return this.authService.regenerateActivationCode(body.email);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('emailOrPhone') emailOrPhone: string) {
    return this.authService.requestPasswordReset(emailOrPhone);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(email, code, newPassword);
  }
}

import { Controller, Post, Body, UseGuards, Request, Get, Response, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // @Post('register')
  // async register(@Body() registerUserDto, @Response() res) {
  //   console.log('registerUserDto received:', registerUserDto);
  //   return this.authService.register(registerUserDto, res);
  // }

  @Post('register')
  @UseInterceptors(FileInterceptor('foto'))
  async register(
    @Body() body, 
    @UploadedFile() file: Express.Multer.File, 
    @Response() res
  ) {
    console.log('Body received:', body);
    const registerUserDto = plainToClass(RegisterUserDTO, body);
    console.log('registerUserDto after transformation:', registerUserDto);
    return this.authService.register(registerUserDto, file, res);
  }
  

  @Post('login')
  async login(@Body() loginUserDto, @Response() res) {
    return this.authService.login(loginUserDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('User from JWT:', req.user); // Adicione este log
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSession(@Request() req) {
    return req.user;
  }

  // @Post('logout')
  // async logout(@Response() res) {
  //   return this.authService.logout(res);
  // }

  @Post('activate')
  async activateUser(@Body() body: { email: string, code: string }) {
    const activationResult = await this.authService.activateUser(body.email, body.code);
    if (activationResult) {
      return { success: true, message: 'Conta ativada com sucesso' };
    } else {
      throw new BadRequestException('Código de ativação inválido.');
    }
  }

  @Post('regenerate-activation-code')
  async regenerateActivationCode(@Body() body: { email: string }) {
    return this.authService.regenerateActivationCode(body.email);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    // console.log('Email recebido:', emailOrPhone); // Adicione isso para verificar o valor recebido
    return this.authService.requestPasswordReset(email);
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

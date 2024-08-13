import { Controller, Post, Body, UseGuards, Request, Get, Response } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';
import { plainToClass } from 'class-transformer';

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
  async register(@Body() body, @Response() res) {
      console.log('Raw Body received:', body); // Verifique o corpo cru
      return res.status(200).send(body); // Apenas retorne o corpo para verificação
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

  @Post('logout')
  async logout(@Response() res) {
    return this.authService.logout(res);
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

import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';
import { LoginUserDTO } from 'src/interface-adapters/dtos/LoginUserDTO';
import { UserRegistrationService } from './auth-methods/user-registration.service';
import { AuthenticationService } from './auth-methods/authentication.service';
import { PasswordResetService } from './auth-methods/password-reset.service';
import { CodeService } from './auth-methods/code.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly codeService: CodeService,
  ) {}

  async register(registerUserDto: RegisterUserDTO, file?: Express.Multer.File | null, res?: Response) {
    try {
      const result = await this.userRegistrationService.register(registerUserDto, file);
      res.status(201).json({ message: 'Registro bem-sucedido!', data: result });
    } catch (error) {
      console.error('Erro durante o registro:', error);
      const statusCode = error.status || 500;
      const errorMessage = error.response?.message || 'Ocorreu um erro durante o registro';
      res.status(statusCode).json({ message: errorMessage });
    }
  }

  async login(loginUserDto: LoginUserDTO, res: Response) {
    try {
      const { accessToken } = await this.authenticationService.login(loginUserDto);
      console.log('accessToken', accessToken)
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });
      // Enviando a resposta com o token no corpo, como um teste
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  }
  

  // async logout(res: Response) {
  //   console.log("SAIR")
  //   try {
  //     res.clearCookie('jwt', {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  //     });
  //     res.status(200).json({ message: 'Logout successful' });
  //   } catch (error) {
  //     console.error('Erro durante o logout:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // }

  async requestPasswordReset(email: string) {
    return this.passwordResetService.requestPasswordReset(email);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.passwordResetService.resetPassword(email, code, newPassword);
  }

  async activateUser(email: string, code: string) {
    return this.codeService.activateUser(email, code);
  }

  async regenerateActivationCode(email: string) {
    return this.codeService.regenerateActivationCode(email);
  }
}

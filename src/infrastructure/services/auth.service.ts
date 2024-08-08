import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';
import { LoginUserDTO } from 'src/interface-adapters/dtos/LoginUserDTO';
import { UserRegistrationService } from './auth-methods/user-registration.service';
import { AuthenticationService } from './auth-methods/authentication.service';
import { PasswordResetService } from './auth-methods/password-reset.service';
import { CodeService } from './auth-methods/code.service';
import { Express } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly codeService: CodeService,
  ) {}

  async register(registerUserDto: RegisterUserDTO, file?: Express.Multer.File) {
    return this.userRegistrationService.register(registerUserDto, file);
  }

  async login(loginUserDto: LoginUserDTO) {
    return this.authenticationService.login(loginUserDto);
  }

  async requestPasswordReset(emailOrPhone: string) {
    return this.passwordResetService.requestPasswordReset(emailOrPhone);
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

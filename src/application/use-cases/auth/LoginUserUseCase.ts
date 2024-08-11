import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { LoginUserDTO } from 'src/interface-adapters/dtos/LoginUserDTO';
import { Response } from 'express';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async execute(loginUserDto: LoginUserDTO, res: Response) {
    return this.authService.login(loginUserDto, res);
  }
}

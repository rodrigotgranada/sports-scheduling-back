import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async execute(registerUserDto: RegisterUserDTO) {
    return this.authService.register(registerUserDto);
  }
}

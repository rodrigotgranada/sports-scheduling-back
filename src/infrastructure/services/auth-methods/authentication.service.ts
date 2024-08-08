import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { LoginUserDTO } from 'src/interface-adapters/dtos/LoginUserDTO';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDTO): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.findUserByEmail(loginUserDto.email);
      if (!user) {
        throw new BadRequestException('Credenciais inválidas');
      }

      const passwordMatches = await compare(loginUserDto.password, user.password);
      if (!passwordMatches) {
        throw new BadRequestException('Credenciais inválidas');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

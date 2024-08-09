// src/infrastructure/services/user-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Inject } from '@nestjs/common';
import { User } from 'src/domain/entities/User';

@Injectable()
export class UserStatusService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async updateUserStatus(id: string, status: 'active' | 'blocked', updatedBy: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    user.isActive = status;
    user.updatedBy = updatedBy;
    return this.userRepository.updateUser(user);
  }
}

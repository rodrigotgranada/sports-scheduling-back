// src/infrastructure/services/user-retrieval.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Inject } from '@nestjs/common';
import { User } from 'src/domain/entities/User';

@Injectable()
export class UserRetrievalService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }
}

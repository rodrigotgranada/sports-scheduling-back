// src/infrastructure/services/user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { User } from 'src/domain/entities/User';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findUserById(id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.updateUser(user);
  }

  async updateUserStatus(id: string, status: 'active' | 'blocked'): Promise<User> {
    return this.userRepository.updateUserStatus(id, status);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  async createUser(createUserDto: UpdateUserDTO): Promise<User> {
    const user = new User(
      '', // id gerado pelo banco
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.cpf,
      createUserDto.phone,
      createUserDto.email,
      createUserDto.password, // precisa ser hasheado antes de salvar
      'pending', // estado inicial do usuário
      'user', // role padrão
      new Date(),
      new Date(),
      createUserDto.createdBy,
      createUserDto.updatedBy,
      createUserDto.foto
    );

    // Aqui você deve hashear a senha antes de salvar o usuário, caso contrário, a senha será salva como plain text

    return this.userRepository.createUser(user);
  }
}

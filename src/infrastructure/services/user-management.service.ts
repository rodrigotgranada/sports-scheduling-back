// src/infrastructure/services/user-management.service.ts
import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from 'src/domain/entities/User';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ConfigService } from './config.service';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async viewUsers(role: string): Promise<User[]> {
    if (!(await this.configService.canViewUsers(role))) {
      throw new ForbiddenException('Access Denied');
    }
    return this.userRepository.findAllUsers();
  }

  async editUser(role: string, userId: string, updateUserDto: Partial<User>): Promise<User> {
    const editableFields = await this.configService.getEditableFields(role);
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.keys(updateUserDto).forEach((key) => {
      if (editableFields.includes(key)) {
        user[key] = updateUserDto[key];
      }
    });
    return this.userRepository.updateUser(user);
  }

  async deleteUser(role: string, userId: string): Promise<void> {
    if (!(await this.configService.canDeleteUser(role))) {
      throw new ForbiddenException('Access Denied');
    }
    await this.userRepository.deleteUserById(userId);
  }

  async blockUser(role: string, userId: string): Promise<User> {
    if (!(await this.configService.canBlockUser(role))) {
      throw new ForbiddenException('Access Denied');
    }
    const user = await this.userRepository.findUserById(userId);
    user.isActive = 'blocked';
    return this.userRepository.updateUser(user);
  }

  async unblockUser(role: string, userId: string): Promise<User> {
    if (!(await this.configService.canBlockUser(role))) {
      throw new ForbiddenException('Access Denied');
    }
    const user = await this.userRepository.findUserById(userId);
    user.isActive = 'active';
    return this.userRepository.updateUser(user);
  }

  async createUser(role: string, createUserDto: Partial<User>): Promise<User> {
    const createFields = await this.configService.getCreateUserFields(role);
    const user = new User(
      '',
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.cpf,
      createUserDto.phone,
      createUserDto.email,
      createUserDto.password,
      createUserDto.isActive ?? 'pending',
      createUserDto.role ?? 'user',
      new Date(),
      new Date(),
      '',
      '',
      createUserDto.foto ?? ''
    );
    return this.userRepository.createUser(user);
  }
}

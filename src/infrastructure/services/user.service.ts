import { Injectable } from '@nestjs/common';
import { UserManagementService } from './user-methods/user-management.service';
import { UserStatusService } from './user-methods/user-status.service';
import { UserRetrievalService } from './user-methods/user-retrieval.service';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';
import { User } from 'src/domain/entities/User';
import { CreateUserDTO } from 'src/interface-adapters/dtos/CreateUserDTO';

@Injectable()
export class UserService {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly userStatusService: UserStatusService,
    private readonly userRetrievalService: UserRetrievalService,
  ) {}

  async findUserById(id: string): Promise<User> {
    console.log('id', id)
    return this.userRetrievalService.findUserById(id);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRetrievalService.findAllUsers();
  }

  async createUser(createUserDto: CreateUserDTO, createdBy: string, file?: Express.Multer.File): Promise<User> {
    return this.userManagementService.createUser(createUserDto, createdBy, file);
  }

  async updateUser(id: string, updates: Partial<UpdateUserDTO>, updatedBy: string): Promise<User> {
    return this.userManagementService.updateUser(id, updates, updatedBy);
  }

  async deleteUserById(id: string): Promise<void> {
    return this.userManagementService.deleteUserById(id);
  }

  async updateUserStatus(id: string, status: 'active' | 'blocked', updatedBy: string): Promise<User> {
    return this.userStatusService.updateUserStatus(id, status, updatedBy);
  }

  async regenerateActivationCode(user: User): Promise<void> {
    if (user.isActive !== 'pending') {
      throw new Error('Apenas usuários pendentes podem receber um código de ativação.');
    }
    return this.userManagementService.regenerateActivationCode(user);
  }

  async updateUserPassword(id: string, newPassword: string, updatedBy: string): Promise<User> {
    return this.userManagementService.updateUserPassword(id, newPassword, updatedBy);
  }

  async sendResetPasswordCode(user: User): Promise<void> {
    return this.userManagementService.sendResetPasswordCode(user);
  }
}

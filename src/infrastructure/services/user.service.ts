import { BadRequestException, Injectable } from '@nestjs/common';
import { UserManagementService } from './user-methods/user-management.service';
import { UserStatusService } from './user-methods/user-status.service';
import { UserRetrievalService } from './user-methods/user-retrieval.service';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';
import { User } from 'src/domain/entities/User';
import { CreateUserDTO } from 'src/interface-adapters/dtos/CreateUserDTO';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly userStatusService: UserStatusService,
    private readonly userRetrievalService: UserRetrievalService,
  ) {}

  async findUserById(id: string): Promise<User> {
    return this.userRetrievalService.findUserById(id);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRetrievalService.findAllUsers();
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const user = await this.userRetrievalService.findUserByEmail(email);
    return !!user; // Retorna true se o email já está em uso
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRetrievalService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    return bcrypt.compare(password, user.password);
  }

  async createUser(createUserDto: CreateUserDTO, createdBy: string, file?: Express.Multer.File): Promise<User> {
    return this.userManagementService.createUser(createUserDto, createdBy, file);
  }

  async updateUser(
    id: string, 
    updates: Partial<UpdateUserDTO>, 
    updatedBy: string, 
    file?: Express.Multer.File // O arquivo é opcional aqui também
  ): Promise<User> {
    return this.userManagementService.updateUser(id, updates, updatedBy, file);
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

  async updateUserProfilePhoto(userId: string, file: Express.Multer.File): Promise<User> {
    return this.userManagementService.updateUserProfilePhoto(userId, file);
  }
}

// src/domain/repositories/IUserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByCPF(cpf: string): Promise<User | null>;
  findUserByPhone(phone: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  deleteUserById(id: string): Promise<void>;
  updateUserStatus(id: string, status: 'active' | 'blocked'): Promise<User | null>;
  findAllUsers(): Promise<User[]>;
}


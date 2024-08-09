// src/interface-adapters/dtos/CreateUserDTO.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsEnum(['pending', 'active', 'blocked'])
  isActive?: 'pending' | 'active' | 'blocked';

  @IsOptional()
  @IsEnum(['user', 'admin', 'owner'])
  role?: 'user' | 'admin' | 'owner';
}

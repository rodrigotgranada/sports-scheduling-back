// src/interface-adapters/dtos/ResetPasswordDTO.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

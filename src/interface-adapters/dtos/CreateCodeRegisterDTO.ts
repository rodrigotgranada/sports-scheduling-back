import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCodeRegisterDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

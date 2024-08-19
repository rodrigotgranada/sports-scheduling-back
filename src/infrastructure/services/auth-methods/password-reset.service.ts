import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IResetCodeRepository } from 'src/domain/repositories/IResetCodeRepository';
import { hash } from 'bcryptjs';
import { NotificationService } from '../notification.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IResetCodeRepository') private readonly resetCodeRepository: IResetCodeRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email) || await this.userRepository.findUserByPhone(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    await this.deleteExistingResetCode(user.id);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.resetCodeRepository.createResetCode({
      userId: user.id,
      code,
    });

    try {
      if (user.email === email) {
        await this.notificationService.sendEmail(user.email, 'Código de Redefinição de Senha', `Seu código de redefinição de senha é ${code}`);
        return 'Código de redefinição de senha enviado com sucesso para o email informado';
      }
      //  else if (user.phone === email) {
      //   await this.notificationService.sendSms(user.phone, `Seu código de redefinição de senha é ${code}`);
      //   return 'Código de redefinição de senha enviado com sucesso para o número informado';
      // }
    } catch (error) {
      console.error(`Erro ao enviar o código de redefinição de senha: ${error.message}`);
      throw new InternalServerErrorException('Erro ao enviar o código de redefinição de senha');
    }
  }

  async deleteExistingResetCode(userId: string): Promise<void> {
    const existingCode = await this.resetCodeRepository.findResetCodeByUserId(userId);
    if (existingCode) {
      await this.resetCodeRepository.deleteResetCodeByUserId(userId);
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const resetCode = await this.resetCodeRepository.findResetCodeByUserId(user.id);
    if (!resetCode || resetCode.code !== code) {
      throw new BadRequestException('Código de redefinição de senha inválido');
    }

    // Verificação da validade do código
    const currentTime = new Date().getTime();
    const codeTime = new Date(resetCode.createdAt).getTime();
    const expirationTime = 30 * 60 * 1000; // 30 minutos em milissegundos

    if (currentTime - codeTime > expirationTime) {
      throw new BadRequestException('Código de redefinição de senha expirado');
    }

    const hashedPassword = await hash(newPassword, 8);
    user.password = hashedPassword;
    await this.userRepository.updateUser(user);
    await this.resetCodeRepository.deleteResetCodeByUserId(user.id);

    return 'Senha alterada com sucesso';
  }
}

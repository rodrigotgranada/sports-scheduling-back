import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ICodeRegisterRepository } from 'src/domain/repositories/ICodeRegisterRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { NotificationService } from '../notification.service';

@Injectable()
export class CodeService {
  constructor(
    @Inject('ICodeRegisterRepository') private readonly codeRegisterRepository: ICodeRegisterRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async activateUser(email: string, code: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const codeRegister = await this.codeRegisterRepository.findCodeByUserId(user.id);
    if (!codeRegister || codeRegister.code !== code) {
      throw new BadRequestException('Código inválido');
    }

    user.isActive = 'active';
    await this.userRepository.updateUser(user);
    await this.codeRegisterRepository.deleteCodeRegisterByUserId(user.id);
    

    return 'Usuário ativado com sucesso';
  }

  async regenerateActivationCode(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('Email não encontrado');
      }

      if (user.isActive !== 'pending') {
        throw new BadRequestException('Usuário já está ativo ou bloqueado');
      }

      // Deletar código existente
      await this.codeRegisterRepository.deleteCodeRegisterByUserId(user.id);

      // Gerar novo código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.codeRegisterRepository.createCodeRegister({
        userId: user.id,
        code,
      });

      try {
        // Tentar enviar o código via SMS
        await this.notificationService.sendSms(user.phone, `Seu novo código de ativação é ${code}`);
        return { message: 'Novo código de ativação criado e enviado com sucesso.' };
      } catch (error) {
        return { message: 'Novo código de ativação criado com sucesso, mas ocorreu um erro com o envio, verifique o número cadastrado ou fale com um administrador.' };
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocorreu um erro ao gerar o código, entre em contato com um administrador.');
    }
  }
}

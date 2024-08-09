import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Inject } from '@nestjs/common';
import { DirectoryService } from 'src/infrastructure/services/directory.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadCleanerService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly directoryService: DirectoryService,  // Injetar o DirectoryService
  ) {}

  async checkAndCleanUploads() {
    // Usar o DirectoryService para obter o caminho da pasta 'uploads'
    const uploadDir = this.directoryService['uploadDir'];

    // Obter todos os usuários do banco de dados
    const users = await this.userRepository.findAllUsers();
    const userIds = users.map(user => user.id);

    // Ler todos os diretórios na pasta de uploads
    const directories = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];

    // Verificar diretórios sem usuários correspondentes
    for (const dir of directories) {
      if (!userIds.includes(dir)) {
        fs.rmSync(path.join(uploadDir, dir), { recursive: true, force: true }); // Usar fs.rmSync em vez de fs.rmdirSync
        Logger.log(`Pasta ${dir} removida pois não há usuário correspondente.`);
      }
    }

    // Criar pastas para usuários que não têm, usando o DirectoryService
    for (const userId of userIds) {
      this.directoryService.createUserDir(userId);
      Logger.log(`Pasta verificada/criada para o usuário ${userId}.`);
    }
  }
}

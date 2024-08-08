import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';
import { DirectoryService } from './directory.service';

@Injectable()
export class UploadService {
  constructor(private readonly directoryService: DirectoryService) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato de arquivo inválido');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Tamanho do arquivo muito grande');
    }

    const userDir = this.directoryService.createUserDir(userId);
    const filePath = path.join(userDir, 'profile.jpg');
    fs.writeFileSync(filePath, file.buffer);

    return `uploads/${userId}/profile.jpg`;
  }

  createDirectoryForUserWithoutPhoto(userId: string): void {
    this.directoryService.createUserDir(userId);
  }
}

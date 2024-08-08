import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DirectoryService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.createMainUploadDir();
  }

  createMainUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  createUserDir(userId: string): string {
    const userDir = path.join(this.uploadDir, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    return userDir;
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseStorageService {
  private bucket = admin.storage().bucket();

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const filename = `profile_${uuidv4()}.jpg`;
    const fileUpload = this.bucket.file(`${userId}/${filename}`);

    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true, // Torna o arquivo público (opcional, dependendo da sua necessidade)
      });

      // Gera e retorna a URL pública do arquivo
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${userId}/${filename}`;
      return publicUrl;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao fazer upload da foto para o Firebase Storage');
    }
  }
}

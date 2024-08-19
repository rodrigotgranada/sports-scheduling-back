import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as admin from 'firebase-admin';
import { Express } from 'express';
import { DirectoryService } from './directory.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(
    private readonly directoryService: DirectoryService,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Verifica se o Firebase já foi inicializado
    if (!admin.apps.length) {
      const firebaseConfig = this.configService.get<string>('FIREBASE_CONFIG');
      if (firebaseConfig) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(firebaseConfig)),
          storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
      }
    }
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato de arquivo inválido');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Tamanho do arquivo muito grande');
    }

    const storageProvider = this.configService.get<string>('STORAGE_PROVIDER');

    if (storageProvider === 'aws') {
      return this.uploadToS3(file, userId);
    } else if (storageProvider === 'firebase') {
      return this.uploadToFirebase(file, userId);
    } else {
      throw new BadRequestException('Provedor de armazenamento não configurado');
    }
  }

  private async uploadToS3(file: Express.Multer.File, userId: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const key = `${userId}/profile.jpg`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  private async uploadToFirebase(file: Express.Multer.File, userId: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileRef = bucket.file(`${userId}/profile.jpg`);
    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });
  
    // Gera a URL pública do arquivo no formato correto
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.configService.get<string>('FIREBASE_STORAGE_BUCKET')}/o/${encodeURIComponent(fileRef.name)}?alt=media`;
    
    return publicUrl;
  }
  
  
}

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { seedConfig } from './infrastructure/database/seed/config.seed';
import { UploadCleanerService } from './infrastructure/services/checkAndCleanUploads'; // Importando a função

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // Porta padrão 3000 caso a variável PORT não esteja definida

  try {
    const uri = configService.get<string>('MONGODB_URI');
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');

    await seedConfig(); // Chame o seeder aqui

    // Verificar e limpar uploads
    const uploadCleanerService = app.get(UploadCleanerService);
    await uploadCleanerService.checkAndCleanUploads();

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }

  app.useGlobalPipes(new ValidationPipe()); // Adicionar o ValidationPipe globalmente
  app.use(express.json()); // Certifique-se de adicionar esta linha para habilitar o body parser
  app.use(express.urlencoded({ extended: true }));

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

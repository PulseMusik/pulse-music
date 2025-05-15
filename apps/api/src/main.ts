import './config/env'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { join } from 'path';
import mongoose, { connect } from 'mongoose';

dotenv.config({ path: join(__dirname, '../../../../.env') });

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function bootstrap() {
  await connectDB()
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
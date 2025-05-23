import './config/env'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { join } from 'path';
import mongoose, { connect } from 'mongoose';

import * as cookieParser from 'cookie-parser'

import * as fs from 'fs'
import * as path from 'path';

import { PULSE_URL, ACCOUNTS_URL } from './constants'

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
  try {
    const httpsOptions = {
      key: fs.readFileSync(path.resolve(__dirname, "../../../https/cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "../../../https/cert.crt"))
    }

    await connectDB()
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    }))
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [PULSE_URL, ACCOUNTS_URL, 'https://artists.localhost'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`❌ CORS blocked for origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });    
    app.use(cookieParser())
    await app.listen(process.env.PORT ?? 8000);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Bootstrap failed:', error.message);
      console.error(error.stack);
    } else {
      console.error('Bootstrap failed:', error);
    }
    process.exit(1);
  }
}
bootstrap();
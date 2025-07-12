import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 3002;
    await app.listen(port);
    
    console.log(`🚀 Payment Dashboard API running on http://localhost:${port}/api`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();

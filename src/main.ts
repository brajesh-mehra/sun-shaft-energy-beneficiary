import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4004 },
    });
  
    // ✅ Use Global Validation Pipes for DTO validation
    app.useGlobalPipes(
      new ValidationPipe({ 
        whitelist: true, 
        forbidNonWhitelisted: true, 
        transform: true, // Ensures DTOs are properly transformed
      })
    );
  
    // ✅ Apply Custom Exception Filters
    app.useGlobalFilters(
      new ValidationExceptionFilter(), 
      new MongoExceptionFilter(), 
      new NotFoundExceptionFilter()
    );
  
    await app.listen();
    console.log('🚀 Beneficiary Management Microservice running on TCP port 4004');
}
bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeneficiaryManagementModule } from './beneficiary-management/beneficiary-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString')
      }),
      inject: [ConfigService]
    }),
    BeneficiaryManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

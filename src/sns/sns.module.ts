import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SnsController } from './sns.controller';
import { SnsService } from './sns.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule
  ],
  controllers: [SnsController],
  providers: [SnsService],
  exports: [SnsService]
})
export class SnsModule {}

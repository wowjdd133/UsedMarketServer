import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DistrictService],
  controllers: [DistrictController],
  exports: [DistrictService]
})
export class DistrictModule {}

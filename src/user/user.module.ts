import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DistrictModule } from 'src/district/district.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    DistrictModule,
    UploadModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

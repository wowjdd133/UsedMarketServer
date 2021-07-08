import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}

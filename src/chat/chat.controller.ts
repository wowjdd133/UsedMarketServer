import { User } from '.prisma/client';
import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { ChatService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat')
@ApiTags('chat')
@ApiCookieAuth('Authentication')
export class ChatController {

    constructor(
        private readonly chatService:ChatService
    ) {}

    @Get('/rooms')
    @UseGuards(JwtGuard)
    getChatRoomList(@UserDecorator() user:User, @Query() query:FindAllDto) {
        return this.chatService.getChatRoomList({...query, userId: user.id});
    }

    @Get('/rooms/:id/chattings')
    @UseGuards(JwtGuard)
    getChattingList(@Query() query:FindAllDto, @Param('id') id:number) {
        return this.chatService.getChattingList({...query, roomId:id});
    }

    @Post('/rooms')
    @UseGuards(JwtGuard)
    createRoom(@UserDecorator() user:User, @Query() query: CreateChatRoomDto) {
        return this.chatService.createChatRoom({
            product: {
                connect: {
                    id: query.productId
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            }
        })
    }

    // @Post('/rooms/:id/chattings')
    // @UseGuards(JwtGuard)
    // createChat(@UserDecorator() user:User, @Param('id') id:number, @Query() query: CreateChatRoomDto) {
    //     return this.chatService.createMessage({
    //         chat_room: {
    //             connect: {
    //                 id: id
    //             }
    //         },
    //         user: {
    //             connect: {
    //                 id: user.id
    //             }
    //         },
            
    //     })
    // }

}

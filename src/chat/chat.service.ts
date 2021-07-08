import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    public createChatRoom(
        data: Prisma.ChatRoomCreateInput
    ) {
        return this.prisma.chatRoom.create({
            data
        });
    }

    public createMessage(
        data: Prisma.ChatMessageCreateInput
    ) {
        return this.prisma.chatMessage.create({
            data
        });
    }

    public getChattingList(params: {
        skip?: number;
        take?: number;
        roomId?: number;
    }) {
        const { skip, take, roomId } = params;;

        const selectUser = {
            select: {
                id: true,
                name: true,
                url: true,
            }
        }

        return this.prisma.chatMessage.findMany({
            skip,
            take,
            where: {
                chat_room_id: roomId,
            },
            orderBy: {
                created_at: 'desc'
            },
            select: {
                content: true,
                content_type: true,
                created_at: true,
                id: true,
                is_read: true,
                user: selectUser
            },
        })
    }

    public getChatRoomList(params: {
        skip?: number;
        take?: number;
        userId?: number;
    }) {
        const { userId, skip, take } = params

        const selectUser = {
            select: {
                id: true,
                name: true,
                url: true,
                district: {
                    select: {
                        sig_kor_name: true
                    }
                }
            }
        }

        return this.prisma.chatRoom.findMany({
            skip,
            take,
            where: {
                AND: [
                    {
                        OR: [{
                            buyer_id: userId
                        }, {
                            product: {
                                user_id: userId
                            }
                        }]
                    },
                    {
                        NOT: {
                            chat_message: {
                                every: {
                                   content: undefined  
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                user: selectUser,
                product: {
                    select: {
                        user: selectUser
                    }
                },
                chat_message: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1,
                    select: {
                        content: true
                    }
                }
            },
        })
    }
}

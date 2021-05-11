import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data:Prisma.UserCreateInput) {
    return 'This action adds a new user';
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput
  }):Promise<User[]> {
    const {cursor, orderBy, skip, take, where} = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

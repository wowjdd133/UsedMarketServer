import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  
  public findAll(params: {
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

  public findOne(params: {
    where?: Prisma.UserWhereUniqueInput
  }):Promise<User> {
    const {where} = params;

    return this.prisma.user.findUnique({
      where
    });
  }

  public createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  public updateUser(params: {
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  }):Promise<User> {
    const { data, where } = params;
    return this.prisma.user.update({
      data,
      where,
    })
  }

  public deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where
    });
  }

  public async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);

    await this.updateUser({
      data: {
        current_hashed_refresh_token: currentHashedRefreshToken
      },
      where: {
        id: id
      }
    });
  }

  public async getUserRefreshTokenMatches(refreshToken: string, id: number):Promise<User | false> {
    const user = await this.findOne({
      where: {
        id: id
      }
    })

    const isTokenMatch = await compare(
      refreshToken,
      user.current_hashed_refresh_token
    );

    if(isTokenMatch) {
      return user;
    }

    return false;
  }

  public async removeRefreshToken(id: number): Promise<User> {
    return this.updateUser({
      data: {
        current_hashed_refresh_token: null
      }, 
      where: {
        id: id
      }
    })
  }
}

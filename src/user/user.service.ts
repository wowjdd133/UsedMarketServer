import { Prisma, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { DistrictService } from 'src/district/district.service';
import { GpsDto } from 'src/district/dto/gps.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly districts: DistrictService
  ) {}
  
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

  async certificateUserDistrict(id: number, {lat, lng}: GpsDto) {
    try {
        const districtData = await this.districts.getNearDistrict({lat, lng, skip: 0, limit: 1});

        if(districtData) {
            if(districtData.district > 5000) {
                throw new HttpException({
                    status: ErrorStatus.NEAR_DISTRICT_NOT_FOUND,
                    message: "가까운 구를 찾을 수 없습니다"
                }, HttpStatus.BAD_REQUEST)
            }

            const user = await this.updateUser({
              data: {
                district: {
                  connect: {
                    id: districtData.id
                  }
                }
              },
              where: {
                id: id
              }
            })

            return user;
        } else {
            throw new HttpException({
                status:HttpStatus.INTERNAL_SERVER_ERROR,
                message:'Internal Server Error',
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    } catch (err) {
        throw err;
    }
}
  
}

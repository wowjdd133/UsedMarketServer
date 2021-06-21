import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { MatchCode } from './dto/matchCode.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { v4 as uuid } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaErrorStatus } from 'src/common/enums/prismaErrorStatus.enum';
import { Prisma } from '.prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
    }

    async login({deviceId, phoneNumber, districtId}:LoginDto) {
        //user service 에서 select넣을시 type을 제대로 리턴 못함
        // 계속 이렇게 써야할듯
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    phone_number: phoneNumber
                }, 
                select: {
                    id: true,
                    device_id: true,
                    district: {
                        select: {
                            id: true,
                            sig_eng_name: true,
                            sig_kor_name: true
                        }
                    }
                }
            });
    
            if(user.device_id !== deviceId) {
                throw new HttpException({
                    status: ErrorStatus.DEVICE_INFO_NOT_MATCHED,
                    message: "디바이스 정보가 일치하지 않습니다."
                }, HttpStatus.BAD_REQUEST)
            }
    
            const {
                accessToken,
                ...accessOption
            } = this.getCookieWithJwtAccessToken(user.id);
    
            const {
                refreshToken,
                ...refreshOption
            } = this.getCookieWithJwtRefreshToken(user.id);
    
            await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    
            return {
                user,
                accessToken,
                accessOption,
                refreshToken,
                refreshOption
            }
        } catch (err) {
            throw err;
        }
    }

    //unqiue error
    async register({deviceId, phoneNumber, districtId}:RegisterDto) {
        try {
            const { id, ...user } = await this.userService.createUser({
                device_id: deviceId,
                phone_number: phoneNumber,
                district: {
                    connect: {
                        id: districtId
                    },
                },
                name: `user_${uuid()}`
            }); 

            const district = await this.prisma.district.findUnique({
                where: {
                    id: user.district_id
                },
                select: {
                    id: true,
                    sig_eng_name: true,
                    sig_kor_name: true
                }
            })
            
            return {
                id,
                district
            };
        } catch (err) {
            console.log(err);
            if(err.code) {
                if(err.code === PrismaErrorStatus.UNIQUE_CONSTRAINT_ERROR) {
                    throw new HttpException({
                        message:'해당 전화번호를 지닌 아이디가 존재합니다.',
                        status: ErrorStatus.PHONE_NUMBER_ALREADY_EXIST
                    }, HttpStatus.CONFLICT);
                }
            }
            throw err;
        }
    }

    async isMatchCode({deviceId, code}:MatchCode) {
        try {
            let dt = new Date(); 
            let prevDt = new Date();
            prevDt.setMinutes(prevDt.getMinutes() - 5);

            const data = await this.prisma.verification
                .findFirst({
                    where: {
                        AND: [{
                            code: {
                                equals: Number(code)
                            }
                        },{
                            device_id: {
                                equals: deviceId
                            }
                        }, {
                            created_at: {
                                gte: prevDt,
                                lt: dt
                            }
                        }]
                    },
                    select: {
                        code: true
                    }
                })

            if(!data) {
                throw new HttpException({
                    status: ErrorStatus.CODE_NOT_MATCHED,
                    message: "코드가 일치하지 않습니다."
                }, HttpStatus.NOT_FOUND);
            }

            //Get인데 삭제하는게 맞을지

            await this.prisma.verification
                .deleteMany({
                    where: {
                        device_id: {
                            equals: deviceId
                        }
                    }
                });
            
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    getCookieWithJwtAccessToken(id: number) {
        const payload = {id};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });

        return {
            accessToken: token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge:
                Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) * 1000,
        };
    }

    getCookieWithJwtRefreshToken(id: number) {
        const payload = {id};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });

        return {
            refreshToken: token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge:
                Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) * 1000,
        };
    }

    getCookiesForLogout() {
        return {
            accessOption: {
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                maxAge: 0
            },
            refreshOption: {
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                maxAge: 0
            }
        }
    }
}

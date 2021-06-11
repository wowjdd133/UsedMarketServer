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

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {}

    //unqiue error
    async register({deviceId, phoneNumber, districtId}:RegisterDto) {
        try {
            const { ...user } = await this.userService.createUser({
                device_id: deviceId,
                phone_number: phoneNumber,
                district: {
                    connect: {
                        id: districtId
                    }
                }
            });

            return user;
        } catch (err) {
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
                    }
                })

            if(!data) {
                throw new HttpException({
                    status: ErrorStatus.CODE_NOT_MATCHED,
                    message: "코드가 일치하지 않습니다."
                }, HttpStatus.NOT_FOUND);
            }

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

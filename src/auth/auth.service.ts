import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginType, Prisma } from '.prisma/client';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly SALT_ROUNDS = 10
    ) {}

    // async validateUser(): Promise<any> {
    //     try {
    //         const user = await this.userService.findOne({
    //             where: {
    //                 email_login_type: {
    //                     email,
    //                     login_type: loginType
    //                 }
    //             }
    //         });
    
    //         if(user) {
    //             if(loginType === "EMAIL") {
    //                 await this.validatePassword(plainTextPassword, user.password);
    //             }
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    //     }
    // }

    // private async validatePassword(
    //     plainTextPassword: string,
    //     hashedPassword: string
    // ) {
    //     const match = await compare(plainTextPassword, hashedPassword);
    //     if(!match) {
    //         throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    //     }
    // }

    //unqiue error
    async register({deviceId, phoneNumber}:RegisterDto) {
        try {
            const { ...user } = await this.userService.createUser({
                device_id: deviceId,
                phone_number: phoneNumber
            });

            return user;
        } catch (err) {
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

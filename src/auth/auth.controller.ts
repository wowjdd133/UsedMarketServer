import { User } from '.prisma/client';
import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ){
        AWS.config.update({
            credentials: {
                accessKeyId: configService.get("AWS_SNS_ACCESS_ID"),
                secretAccessKey: configService.get("AWS_SNS_REGION")
            },
            region: configService.get("AWS_SNS_REGION")
        })
    }

    

    @Post('register')
    async register(@Body() dto:RegisterDto) {
        //loginTypeToken check
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() {deviceId, phoneNumber}:LoginDto, @Res({passthrough: true}) res: Response) {
        const user = await this.userService.findOne({
            where: {
                phone_number: phoneNumber
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
        } = this.authService.getCookieWithJwtAccessToken(user.id);

        const {
            refreshToken,
            ...refreshOption
        } = this.authService.getCookieWithJwtRefreshToken(user.id);

        await this.userService.setCurrentRefreshToken(refreshToken, user.id);

        res.cookie('Authentication', accessToken, accessOption);
        res.cookie('Refresh', refreshToken, refreshOption);

        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Post('logout')
    async logout(@Req() req, @Res({passthrough: true}) res: Response) {
        const {
            accessOption,
            refreshOption
        } = this.authService.getCookiesForLogout();

        await this.userService.removeRefreshToken(req.user.id);

        res.cookie('Authentication', '', accessOption);
        res.cookie('Refresh', refreshOption);
    }
    
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() req, @Res({passthrough: true}) res: Response) {
        const user = req.user;

        const {
            accessToken,
            ...accessOption
        } = this.authService.getCookieWithJwtAccessToken(user.id);

        res.cookie('Authentication', accessToken, accessOption);
        return user;
    }

}

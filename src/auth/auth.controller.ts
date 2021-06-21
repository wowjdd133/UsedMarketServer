import { Prisma, User } from '.prisma/client';
import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { MatchCode } from './dto/matchCode.dto';
import { ApiOperation } from '@nestjs/swagger';

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
        return this.authService.register(dto);
    }

    @Get('code/match')
    async isMatchCode(@Query() query:MatchCode) {
        return this.authService.isMatchCode(query);
    }

    @Post('login')
    @ApiOperation({
        summary: '인증 - 로그인',
    })
    async login(@Body() loginDto:LoginDto, @Res({passthrough: true}) res: Response) {
        const {accessToken, refreshToken, user, accessOption, refreshOption} = await this.authService.login(loginDto);
            
        res.cookie('Authentication', accessToken, accessOption);
        res.cookie('Refresh', refreshToken, refreshOption);

        console.log({user});
    
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

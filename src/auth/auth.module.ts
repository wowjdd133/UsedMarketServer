import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SCRECT"),
        signOptions: {
          expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        }
      })
    })
    
  ],
  providers: [AuthService, JwtRefreshStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}

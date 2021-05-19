import { LoginType, User } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { RegisterDto } from './register.dto';

export class LoginDto extends RegisterDto{
    
} 
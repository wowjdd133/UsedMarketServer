import { Transform } from "class-transformer";
import { IsPhoneNumber, IsString } from "class-validator";

export class RegisterDto {
    @IsPhoneNumber("KR")
    @Transform((value) => value.replace(/\-/g,""))
    phoneNumber: string;

    @IsString()
    deviceId: string;
}
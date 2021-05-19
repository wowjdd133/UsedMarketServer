import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { PhoneNumberDto } from "src/common/dto/phoneNumber.dto";

export class RegisterDto extends PhoneNumberDto {
    @IsString()
    deviceId: string;
}
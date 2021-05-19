import { IsPhoneNumber, IsString } from "class-validator";
import { PhoneNumberDto } from "src/common/dto/phoneNumber.dto";

export class sendCodeDto extends PhoneNumberDto {
    @IsString()
    deviceId: string;
}
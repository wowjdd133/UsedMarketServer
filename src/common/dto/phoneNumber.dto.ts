import { Transform } from "class-transformer";
import { IsPhoneNumber } from "class-validator";

export class PhoneNumberDto {
    @IsPhoneNumber("KR")
    @Transform((value) => value.replace(/\-/g,""))
    phoneNumber: string;
}
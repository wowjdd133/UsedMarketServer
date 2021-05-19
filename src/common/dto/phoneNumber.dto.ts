import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsPhoneNumber } from "class-validator";

export class PhoneNumberDto {
    @IsPhoneNumber("KR")
    @ApiProperty()
    @Transform((value) => value.replace(/\-/g,""))
    phoneNumber: string;
}
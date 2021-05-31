import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { PhoneNumberDto } from "src/common/dto/phoneNumber.dto";

export class MatchCode {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    deviceId: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    @ApiProperty()
    code: string;
}
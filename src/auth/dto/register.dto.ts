import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { PhoneNumberDto } from "src/common/dto/phoneNumber.dto";

export class RegisterDto extends PhoneNumberDto {
    @IsString()
    @ApiProperty({
        default: "test"
    })
    deviceId: string;

    @IsNumber({
        allowNaN: false
    })
    @ApiProperty({
        default: 1
    })
    districtId: number;
}